import { handleHomePageBtnClick, handleSearchPageBtnClick } from "./helpers.js";

const homePageBtn = document.querySelector("#homePageBtn");
homePageBtn.addEventListener("click", handleHomePageBtnClick);

const searchPageBtn = document.querySelector("#searchPageBtn");
searchPageBtn.addEventListener("click", handleSearchPageBtnClick);