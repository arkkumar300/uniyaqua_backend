const ApiResponse = require("../configs/api_response");
const Book = require("../models/book");
const Topic = require("../models/topic");
const Fuse = require("fuse.js");
const uploadToCloud = require("../configs/uploadToCloud");

const createBook = async (req, res) => {
  console.log("Creating Book");
  //Creating Book
  const { image, pdf } = req.files;
  if (image) {
    const { publicUrl } = image[0];
    req.body.thumbnailUrl = publicUrl;
  }
  if (pdf) {
    const { publicUrl } = pdf[0];
    req.body.url = publicUrl;
  }

  // req.body.userId = req.user.id;

  console.log("Creating ", req.body);
  let book = await Book.create(req.body);

  if (!book) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, book);
};

const create = async (req, res) => {
  console.log("Creating Book");
  //Creating Book
  const { image, pdf } = req.files;
  if (image) {
    const { publicUrl } = await image[0];
    req.body.thumbnailUrl = publicUrl;
  }
  if (pdf) {
    const { publicUrl } = await pdf[0];
    req.body.url = publicUrl;
  }

  req.body.userId = req.user.id;

  console.log("Creating ", req.body);
  let book = await Book.create(req.body);

  if (!book) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, book);
};

const getAllBooks = async (req, res) => {
  let bookList = await Book.findAll({
    where: { status: "1" },
    order: [["createdAt", "DESC"]],
    include: [{ model: Topic, as: "topic" }],
  });
  console.log("console dot lod");
  console.log(bookList);
  if (!bookList) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, bookList);
};

const deleteBook = async (req, res) => {
  const { id } = req.params;
  if (!id) return ApiResponse.error(res, "Book ID Not Found", 400);
  let bookList = await Book.destroy({
    where: {
      id: id,
    },
  });

  if (bookList == 0)
    return ApiResponse.error(res, "No Book with this Id ", 200);

  return ApiResponse.success(res, bookList);
};

const getBook = async (req, res) => {

  const { id } = req.params;
  if (!id) return ApiResponse.error(res, "Book ID Not Found", 400);
  let bookList = await Book.findOne({ where: { id: id } });

  if (!bookList) return ApiResponse.error(res, "No Book with this Id ", 200);

  return ApiResponse.success(res, bookList);
};
const updateBook = async (req, res) => {
  var body = req.body;
  const { id } = req.params;
  if (req.files.length > 0) {
    await Promise.all(
      req.files?.map(async (file) => {
        var { url } = await uploadToCloud(file?.filename);
        if (file.fieldname == "image") {
          body.thumbnailUrl = url;
        }
        if (file.fieldname == "pdf") {
          body.url = url;
        }
      })
    );
  }
  if (!id) return ApiResponse.error(res, "Book ID Not Found", 400);
  let booksList = await Book.update(body, {
    where: { id: id },
  });

  if (!booksList) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, booksList);
};
const searchBooks = async (req, res) => {
  const { search } = req.query;
  if (!search) return ApiResponse.error(res, "Book ID Not Found", 400);
  let bookList = await Book.findAll({
    where: {
      status: "1",
    },
    order: [["createdAt", "DESC"]],
  });
  let bookArray = [];
  bookList.map((book) => bookArray.push(book.get()));
  let fuse = new Fuse(bookArray, { keys: ["title"], includeScore: false });
  const searchedResult = fuse.search(search);

  if (!searchedResult)
    return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(
    res,
    searchedResult.map((sl) => sl.item)
  );
};
const filterBooks = async (req, res) => {
  const { id } = req.params;
  if (!id) return ApiResponse.error(res, "Video ID Not Found", 400);
  let booksList = await Book.findAll({
    where: {
      topicId: id,
    },
  });
  if (!booksList) return ApiResponse.error(res, "Something Went Wrong", 200);

  return ApiResponse.success(res, booksList);
};
module.exports = {
  create,
  getAllBooks,
  getBook,
  deleteBook,
  updateBook,
  searchBooks,
  filterBooks,
  createBook,
};
