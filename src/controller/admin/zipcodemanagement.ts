import { Request, Response } from "express";
import { ResponseUtil } from "../../utils/Response";
import { Zipcode } from "../../database/entities/Zipcode";
import { AppDataSource } from "../../database/data-source";
import { Paginator, PaginationInfo } from "../../database/Paginator";
import { Deleted_Status, Status } from "../../constant";
import { City } from "../../database/entities/City";
import { State } from "../../database/entities/State";
import { Country } from "../../database/entities/Country";
import {
  addnewcity,
  addnewcountry,
  addnewstate,
  addnewzipcode,
} from "../../utils/functions";

const zipcodeRepository = AppDataSource.getRepository(Zipcode);
const cityRepository = AppDataSource.getRepository(City);
const stateRepository = AppDataSource.getRepository(State);
const countryRepository = AppDataSource.getRepository(Country);
export class AdminZipCodeController {
  // getAllZipcode
  async getZipcodes(req: Request, res: Response) {
    try {
      const searchKeyword = req.query.searchKeyword || ""; // Provide a default value
      let sortOrder: "DESC" | "ASC" = "DESC";
      const sortingDirection = req.query.sortOrder as string;

      if (sortingDirection === "-1") {
        sortOrder = "DESC";
      } else if (sortingDirection === "1") {
        sortOrder = "ASC";
      }

      const queryBuilder = AppDataSource.getRepository(Zipcode)
        .createQueryBuilder("zipcode")
        .leftJoinAndSelect("zipcode.city", "city")
        .leftJoinAndSelect("city.state", "state")
        .leftJoinAndSelect("state.country", "country")
        .andWhere(
          "(city.name LIKE :searchKeyword OR zipcode.zipcode LIKE :searchKeyword OR zipcode.status = :searchKeyword )",
          { searchKeyword: `%${searchKeyword}%` }
        )
        .orderBy("zipcode.id", sortOrder)
        .select([
          "zipcode.id",
          "zipcode.zipcode",
          "city.id",
          "city.name",
          "state.id",
          "state.name",
          "country.id",
          "country.name",
          "zipcode.status",
        ]);

      // Paginate the query results
      const {
        records: zipcodes,
        paginationInfo,
      }: { records: Zipcode[]; paginationInfo: PaginationInfo } =
        await Paginator.paginate(queryBuilder, req);

      const userData = zipcodes.map((zipcode: Zipcode) => ({
        zipcode_id: zipcode.id,
        zipcode: zipcode.zipcode,
        city_id: zipcode.city.id,
        city_name: zipcode.city.name,
        state_id: zipcode.city.state.id,
        state_name: zipcode.city.state.name,
        country_id: zipcode.city.state.country.id,
        country_name: zipcode.city.state.country.name,
        status: zipcode.status,
      }));

      return ResponseUtil.sendResponse(
        res,
        "Zip Codes Fetched Successfully",
        userData,
        paginationInfo
      );
    } catch (error) {
      return ResponseUtil.sendErrror(res, "Internal server error", 500, error);
    }
  }

  //deletedZipcode api
  async deleteZipcodeById(req: Request, res: Response) {
    try {
      const zipcodeId = parseInt(req.params.id, 10);
      const zipcode = await zipcodeRepository.findOne({
        where: { id: zipcodeId },
      });

      if (!zipcode) {
        return ResponseUtil.sendErrror(
          res,
          "Zipcode not found",
          401,
          "Zipcode not found"
        );
      }

      zipcode.is_deleted = Deleted_Status.DELETED;
      zipcode.updated_on = new Date();
      await zipcodeRepository.save(zipcode);

      return ResponseUtil.sendResponse(
        res,
        "Zipcode deleted successfully",
        zipcode
      );
    } catch (error) {
      return ResponseUtil.sendErrror(
        res,
        "Failed to delete zipcode",
        500,
        "Internal server error"
      );
    }
  }

  // addzipcode api
  async addZipcode(req: Request, res: Response) {
    try {
      const { zipcode, city, state, country } = req.body;

      // Check if the zip code already exists
      let existingZipCode = await zipcodeRepository.findOne({
        where: { zipcode },
      });

      if (!existingZipCode) {
        // Check if the city exists within the state
        let existingCity = await cityRepository.findOne({
          where: { name: city },
        });

        if (!existingCity) {
          // Check if the state exists within the country
          let existingState = await stateRepository.findOne({
            where: { name: state },
          });

          if (!existingState) {
            let existingCountry = await countryRepository.findOne({
              where: { name: country },
            });

            if (!existingCountry) {
              const newCountry = await addnewcountry(country);
              const newstate = await addnewstate(state, newCountry.id);
              const newcity = await addnewcity(city, newstate.id);
              const newZipcode = await addnewzipcode(zipcode, newcity.id);
            } else {
              const newstate = await addnewstate(state, existingCountry.id);
              const newcity = await addnewcity(city, newstate.id);
              const newZipcode = await addnewzipcode(zipcode, newcity.id);
            }
          } else {
            const newcity = await addnewcity(city, existingState.id);
            const newZipcode = await addnewzipcode(zipcode, newcity.id);
          }
        } else {
          await addnewzipcode(zipcode, existingCity.id);
        }
      } else {
        return ResponseUtil.sendErrror(
          res,
          " Zip code already exists",
          401,
          " Zip code already exists"
        );
      }
      return ResponseUtil.sendResponse(res, "Zip Codes added Successfully", "");
    } catch (error) {
      return ResponseUtil.sendErrror(res, "Internal server error", 500, error);
    }
  }

  // Zipcode Status
  async orderStatus(req: Request, res: Response) {
    try {
      const { status, zipcodeId } = req.body;
      const validStatuses = Object.values(Status);

      if (!validStatuses.includes(status)) {
        return ResponseUtil.sendErrror(
          res,
          "Invalid status provided",
          400,
          "Invalid status"
        );
      }

      const zipcode = await zipcodeRepository.findOne({
        where: { id: zipcodeId },
      });

      if (!zipcode) {
        return ResponseUtil.sendErrror(
          res,
          "Zipcode not found",
          404,
          "Zipcode not found"
        );
      }

      zipcode.status = status as Status;
      await zipcodeRepository.save(zipcode);

      return res.json({ message: `Zipcode ${status} successfully` });
    } catch (error) {
      console.error(error);
      return ResponseUtil.sendErrror(
        res,
        "Failed to update Zipcode status",
        500,
        "Internal server error"
      );
    }
  }
}
