const Task = require("../models/tasks.model");

const paginationHelper = require("../../../helpers/pagination");
const searchHelper = require("../../../helpers/search");
// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {


  const find = {
    $or: [
      { createdBy: req.user.id },
      { listUser: req.user.id }
    ],
    deleted: false
  }

  if (req.query.status) {
    find.status = req.query.status;
  }

  // Sort
  const sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  }
  // End Sort

  const countTask = await Task.countDocuments(find);

  //Pagination

  let initPagination = {
    currentPage: 1,
    limitItems: 2
  }

  let objPagination = paginationHelper(
    initPagination,
    req.query,
    countTask

  )

  // End Pagination

  // Search
  const objSearch = searchHelper(req.query);

  if (objSearch.regax) {
    find.title = objSearch.regax;
  }

  const Tasks = await Task.find(find)
    .sort(sort)
    .limit(objPagination.limitItems)
    .skip(objPagination.skip);


  res.json(Tasks);
}

// [GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const tasks = await Task.find({
      _id: id,
      deleted: false

    });

    res.json(tasks);
  } catch (error) {
    res.json("Không tìm thấy!");
  }
}

// [GET] /api/v1/tasks/change-status/:id

module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;

    await Task.updateOne({
      _id: id
    }, {
      status: status
    });
    res.json({
      code: 200,
      message: "Cập nhật trạng thái thành công!"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại!"
    });
  }
}

module.exports.changeMulti = async (req, res) => {
  try {
    const { ids, key, value } = req.body;

    switch (key) {
      case "status":
        await Task.updateMany({
          _id: { $in: ids }
        }, {
          status: value
        });

        res.json({
          code: 200,
          message: "Cập nhật trạng thái thành công!"
        });

        break;
    case "delete":
        await Task.updateMany({
          _id: { $in: ids }
        }, {
          deleted: true,
          deletedAt: new Date()
        });

        res.json({
          code: 200,
          message: "Xoá thành công!"
        });

        break;
      default:
        res.json({
          code: 400,
          message: "Không tồn tại!"
        });
        break;
    }


  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại!"
    });
  }
}

module.exports.create = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    const task = new Task(req.body);
    const data = await task.save();

    res.json({
      code: 200,
      message: "Tạo thành công!",
      data: data
    });

  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    });
  }
}


module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    await Task.updateOne({
      _id: id
    }, req.body)

    res.json({
      code: 200,
      message: "Tạo thành công!",
    });

  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    });
  }
}


module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    await Task.updateOne({
      _id: id
    },{
      deleted:true,
      deletedAt: new Date()
    })

    res.json({
      code: 200,
      message: "Xóa thành công!",
    });

  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    });
  }
}
