module.exports = (objPagination, query, countRecord) => {
    if(query.page){
        objPagination.currentPage=parseInt(query.page);
    }

    if(query.limit){
        objPagination.limitItems=parseInt(query.limit);
    }
    // Tính toán số sản phẩm cần bỏ qua
    objPagination.skip = (objPagination.currentPage - 1) * objPagination.limitItems;

    // Tính toán tổng số trang dựa trên tổng số sản phẩm
    objPagination.totalPage = Math.ceil(countRecord / objPagination.limitItems);

    return objPagination;
};