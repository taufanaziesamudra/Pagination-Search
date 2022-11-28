import User from "../models/USerModel.js";
import { Op } from "sequelize";

export const getUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 0; // Page membutuhkan data string
  const limit = parseInt(req.query.limit) || 10; // Batas yang akan ditampilkan 10 page
  const search = req.query.search_query || ""; // Untuk menampung keyword yang diketik oleh user pencarian
  const offset = limit * page;
  const totalRows = await User.count({
    // Mengambil total keseluruhan data
    where: {
      [Op.or]: [
        {
          name: {
            // Melakuakan pencarian berdasarkan name
            [Op.like]: "%" + search + "%",
          },
        },
        {
          email: {
            // Melakukan pencarian berdasarkan email
            [Op.like]: "%" + search + "%",
          },
        },
      ],
    },
  });
  const totalPage = Math.ceil(totalRows / limit); // Untuk menapilkan totalpage
  const result = await User.findAll({
    // Menampilkan data
    where: {
      [Op.or]: [
        {
          name: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          email: {
            [Op.like]: "%" + search + "%",
          },
        },
      ],
    },
    offset: offset,
    limit: limit,
    order: [["id", "DESC"]], // Mengurutkan data yang terbaru
  });
  res.json({
    result: result,
    page: page,
    limit: limit,
    totalRows: totalRows,
    totalPage: totalPage,
  });
};
