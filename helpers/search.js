module.exports=(query)=>{
    let objSearch={
        keyword: ""
    }

    if(query.keyword){
        objSearch.keyword=query.keyword;
        const regax=new RegExp(query.keyword,"i");
        objSearch.regax=regax;
    }
    return objSearch;

}