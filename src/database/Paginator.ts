// Paginator.ts
import { Request, Response } from 'express';

export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  searchKeyword: string;
  totalItems: number;
  pages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export class Paginator {
  static async paginate(queryBuilder, req: Request): Promise<{ records: any[], paginationInfo: PaginationInfo }> {
    try {
      let page = Number(req.query.currentPage) || 1;
      // console.log(page)
      let pageSize = Number(req.query.pageSize) || 10;
      // let searchKeyword = req.query.search || '';
      const offset = (page - 1) * pageSize;
      

      let query = queryBuilder.skip(offset).take(pageSize);
      // let searchKeyword = req.query.search as string || '';
      let searchKeyword = req.query.search as string ||'';

      const records = await query.getMany();
      const totalItems = await query.getCount();

      const pages = Math.ceil(totalItems / pageSize);
      const currentPage = offset / pageSize + 1;
      const hasNext = currentPage < pages;
      const hasPrevious = currentPage > 1;

      const paginationInfo: PaginationInfo = {
        currentPage: page,
        pageSize: pageSize,
        searchKeyword: searchKeyword,
        totalItems,
        pages,
        hasNext,
        hasPrevious,
      };
    
      return { records, paginationInfo };
    } catch (error) {
      throw new Error(`Pagination error: ${error}`);
    }
  }
}
