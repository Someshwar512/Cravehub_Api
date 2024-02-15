import { Request, Response } from "express";
import { ResponseUtil } from "../../utils/Response";
import { AppDataSource } from "../../database/data-source";
import { Paginator, PaginationInfo } from "../../database/Paginator";
import { DatabaseTables, Roles } from '../../constant';
import { ILike } from "typeorm";
import { EmailTemplate } from "../../database/entities/Email_Template";
import { Deleted_Status } from "../../constant";

const emailrepository = AppDataSource.getRepository(EmailTemplate)

export class EmailTemplatecontroller {
  // get all Email Template data
  async viewAllEmailTemplates(req: Request, res: Response) {
    const searchKeyword = req.query.searchKeyword || "";

    try {
      const allemailQuery = await emailrepository
        .createQueryBuilder(DatabaseTables.EMAIL_TEMPLATE)
        .where([
          { title: ILike(`%${searchKeyword}%`) },
          { subject: ILike(`%${searchKeyword}%`) },
        ])
        .andWhere("email_template.is_deleted = :isDeleted", {
          isDeleted: Deleted_Status.NOT_DELETED,
        });

      const {
        records,
        paginationInfo,
      }: { records: EmailTemplate[]; paginationInfo: PaginationInfo } =
        await Paginator.paginate(allemailQuery, req);

      const emailList = records.map((email) => ({
        id: email.id,
        email_title: email.title,
        email_subject: email.subject,
        email_content: email.content,
      }));

      return ResponseUtil.sendResponse(
        res,
        "Email Template retrieved successfully",
        emailList,
        paginationInfo
      );
    } catch (error) {
      console.error("Error in Email Template:", error);
      return ResponseUtil.sendErrror(res, "Internal server error", 500, error);
    }
  }

  // add Email Template
  async addemailtemplate(req: Request, res: Response) {
    try {
      // Move the declaration of type before using it
      const { title, subject, content, slug } = req.body;

      // Decode the Base64-encoded HTML content
      //   const decodedContent = Buffer.from(content, 'base64').toString('utf-8');

      const newemailtemplate = new EmailTemplate();
      newemailtemplate.title = title;
      newemailtemplate.subject = subject;
      newemailtemplate.content = content;
      newemailtemplate.slug = slug;

      const savedemailtemplate = await emailrepository.save(newemailtemplate);

      return ResponseUtil.sendResponse(
        res,
        "Email Template added successfully",
        savedemailtemplate
      );
    } catch (error) {
      return ResponseUtil.sendErrror(res, "Internal server error", 500, error);
    }
  }

  // view Email Template
  async ViewemailTemplate(req: Request, res: Response) {
    try {
      const emailtemplateiID = parseInt(req.params.id, 10);
      const email_template = await emailrepository
        .createQueryBuilder("email_template")
        .where("email_template.id = :emailtemplateiID", { emailtemplateiID })
        .getOne();

      if (!email_template) {
        return ResponseUtil.sendErrror(
          res,
          "Email Template not found",
          404,
          "Email Template not found"
        );
      }

      const email_templateData = {
        email_template_id: email_template.id,
        title: email_template.title,
        subject: email_template.subject,
        content: email_template.content,
      };

      return ResponseUtil.sendResponse(
        res,
        "Email Template Retrieved Successfully",
        email_templateData
      );
    } catch (error) {
      console.error(error);
      return ResponseUtil.sendErrror(res, "Internal server error", 500, error);
    }
  }

  // Delete Email Template
  async deleteEmailTemplate(req: Request, res: Response) {
    try {
      const emailtemplateID = parseInt(req.params.id, 10);
      const email = await emailrepository.findOne({
        where: { id: emailtemplateID },
      });

      if (!email) {
        return ResponseUtil.sendErrror(
          res,
          "User not found",
          404,
          "User not found"
        );
      }

      email.is_deleted = Deleted_Status.DELETED;

      await emailrepository.save(email);

      return ResponseUtil.sendResponse(
        res,
        "Email Template deleted successfully",
        email
      );
    } catch (error) {
      return ResponseUtil.sendErrror(
        res,
        "Failed to Email Template",
        500,
        "Internal server error"
      );
    }
  }

  // Update Email Template By Id API
  async updateEmailTemplate(req: Request, res: Response) {
    const emailtemplateID = parseInt(req.params.id, 10);
    const emailTemplate = await emailrepository.findOne({
      where: { id: emailtemplateID },
    });

    if (!emailTemplate) {
      return ResponseUtil.sendErrror(
        res,
        "Email Template not found",
        404,
        "Email Template not found"
      );
    }

    const { title, subject, content } = req.body;

    // Update Email Template properties with new data
    emailTemplate.title = title;
    emailTemplate.subject = subject;
    emailTemplate.content = content;

    // Save the updated Email Template and address in the database
    await emailrepository.save(emailTemplate);

    // Prepare the response object
    const userData = {
      emailTemplate_id: emailTemplate.id,
      title: emailTemplate.title,
      subject: emailTemplate.subject,
      content: emailTemplate.content,
    };

    return ResponseUtil.sendResponse(
      res,
      "Email Template updated successfully",
      userData
    );
  }
}
