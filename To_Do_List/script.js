/*
請Export 你完成的codepen資料夾, 並修改在disc下的Index.html內的, 
將完成後的disc資料夾壓縮, 存成姓名.zip上傳
 1.請完成老師上課教授的 To Do List Project (所有功能皆具備) (30%)  ok
 2. Deleted 功能進階 
  2.1 請新增一個 Deleted 的Tab 按鈕選項(換言之原本只有, All, To Do, Completed. 
    改為 All, To Do, Completed, Deleted. (10%) ok
  2.2 對於使用者在 All, To Do, Completed 中選取 deleted 圖示時(deleted 的圖示 為 fill 的) 
    出現提示訊息(確認/取消), 提醒使用者確定要刪除該task? (10%) 
  2.3 使用者若確認刪除, 則 Deleted 的任務中會出現該 task(20%) 
  2.4 使用者點選取消, 則回到原來畫面 (10%)
  2.5 當使用者在 deleted 中將圖示由 fill 改為原來為選取的圖示時, 則該任務回到刪除前的狀態(20%)
*/


//select elements in Dom
const form = document.querySelector("#itemForm");
const itemInput = document.querySelector("#itemInput");
const itemsList = document.querySelector("#itemsList");
const filters = document.querySelectorAll(".nav-item");
const alertDiv = document.querySelector("#message");
//create an empty item list
let todoItems =[];

/*
// 4.在 handle 內做處理
//this.firstElementChild.classList.replace(currentClass, iconClass);
//切換 tab   
const filterType = document.querySelector("#tabValue").value;
getItemsFilter(filterType);
*/
// 3. 在 documents 中設定為 active
//filter tabs (檢查前面的 ; 有沒有)
filters.forEach((tab) => {
  tab.addEventListener('click', function (e) {
    e.preventDefault();
    const tabType = this.getAttribute("data-type");
    document.querySelectorAll(".nav-link").forEach((nav) => {
      nav.classList.remove("active");
    });
    this.firstElementChild.classList.add("active");
    getItemsFilter(tabType);
    document.querySelector("#tabValue").value = tabType;
  })
})

// 2.判斷使用者輸入
//filter items
const getItemsFilter = function (type) {
  let filterItems = [];
  switch (type) {
    case "todo":
      filterItems = todoItems.filter((item) => !item.isDone && !item.isDelete);
      break;
    case "done":
      filterItems = todoItems.filter((item) => item.isDone && !item.isDelete);
      break;
    case "delete":
      filterItems = todoItems.filter((item) => item.isDelete);
      break;
    default:
      filterItems = todoItems;
  }
  getList(filterItems);
}

//接著處理資料更新
//update function
const updateItem = function (currentItemIndex, value) {
  const newItem = todoItems[currentItemIndex];
  newItem.name = value;
  todoItems.splice(currentItemIndex, 1, newItem);
  setLocalStorage(todoItems);
}

const alertMessage = function (message, className) {
    alertDiv.innerHTML = message;
    alertDiv.classList.add(className, "show");
    alertDiv.classList.remove("hide");
    setTimeout(() => {
        alertDiv.classList.add("hide");
        alertDiv.classList.remove("show");
    }, 3000)
}

const removeItem = function (item) {
    const removeIndex = todoItems.indexOf(item);
    todoItems.splice(removeIndex, 1);
}

const handleItem = function(itemData){
  const items = document.querySelectorAll(".list-group-item");
  items.forEach((item) =>{
    //done 我抓取的item產生時間與所對應的產生時間相同
    if (item.querySelector(".title").getAttribute('data-time') == itemData.addedAt){
      item.querySelector('[data-done]').addEventListener('click', function(e){
        e.preventDefault();

        const itemIndex = todoItems.indexOf(itemData);
        const currentItem = todoItems[itemIndex];

        //符號變色
        const currentClass = currentItem.isDone
        ? "bi-check-circle-fill"
        : "bi-check-circle";


        currentItem.isDone = currentItem.isDone ? false : true;
        //把選定的 item 先分別出來,接著更新在 localStorage 的資料
        todoItems.splice(itemIndex, 1, currentItem);
        setLocalStorage(todoItems);

        //設定 icon 的變化
        const iconClass = currentItem.isDone
        ? "bi-check-circle-fill"
        : "bi-check-circle";
        this.firstElementChild.classList.replace(currentClass, iconClass);
        //切換 tab     
        const filterType = document.querySelector("#tabValue").value;
        getItemsFilter(filterType);
      });
      
      //edit
      item.querySelector("[data-edit]").addEventListener("click", function (e) {
        e.preventDefault();
        itemInput.value = itemData.name;
        document.querySelector("#objIndex").value = todoItems.indexOf(itemData);
      });
      //delete
      item.querySelector("[data-delete]").addEventListener("click", function (e) {
        e.preventDefault();
        if (confirm("Are you sure you want to remove this item?")) {     
          /*
          //刪除
          itemsList.removeChild(item);
          //到 storage 刪除並更新
          removeItem(item);
          setLocalStorage(todoItems);
          */
          //提醒使用者
          alertMessage("Item has been deleted", "alert-success");

          const itemIndex = todoItems.indexOf(itemData);
          const currentItem = todoItems[itemIndex];

          //符號變色
          const currentClass = currentItem.isDelete
          ? "bi-x-circle-fill"
          : "bi-x-circle";


          currentItem.isDelete = currentItem.isDelete ? false : true;
          //把選定的 item 先分別出來,接著更新在 localStorage 的資料
          todoItems.splice(itemIndex, 1, currentItem);
          setLocalStorage(todoItems);

          //設定 icon 的變化
          const iconClass = currentItem.isDelete
          ? "bi-x-circle-fill"
          : "bi-x-circle";
          this.firstElementChild.classList.replace(currentClass, iconClass);
          //切換 tab     
          const filterType = document.querySelector("#tabValue").value;
          getItemsFilter(filterType);
        }
      }); 
      
    }    
  })  
};

// 2. 接著我們利用 getList 的方法將使用者輸入的資料 直接寫成 html 的語法顯示在網頁上 
// 2.1 利用 if/else 判斷 
// 2.2 利用 javascript 取代 li 的 tag
// 2.3 將原本 span 內固定的文字 (Task1) 變成可以讀取外部的輸入
// 2.4 將資料呈現 
const getList = function(todoItems){
  itemsList.innerHTML = ""; 
  //2.1
  if(todoItems.length > 0){
    //2.2
    todoItems.forEach((item) =>{

      const iconClass = item.isDone
      ? "bi-check-circle-fill"
      : "bi-check-circle";

      const iconClass2 = item.isDelete
      ? "bi-x-circle-fill"
      : "bi-x-circle";
      
      let liTag=`
      <li class="list-group-item d-flex justify-content-between align-items-center">        
      <span class="title" data-time=${item.addedAt}>${item.name}</span>
          <span>
            <a href="#" data-done><i class="bi ${iconClass}  green"></i></a>
            <a href="#" data-edit><i class="bi bi-pencil-square blue"></i></a>
            <a href="#" data-delete><i class="bi ${iconClass2} red"></i></a>
          </span>
        </li>`;
      //
      itemsList.insertAdjacentHTML("beforeend", liTag);
      handleItem(item);
      //
    });
  }
  else{
    let liTag = `
        <li class="list-group-item d-flex justify-content-between align-items-center">
               <span>No Records Found.</span>
        </li>`;
    itemsList.insertAdjacentHTML("beforeend", liTag);
  }
}

// get items from LocalStorage
const getLocalStorage = function(){
  const todoStorage = localStorage.getItem("todoItems");
  if (todoStorage ==="undefined" || todoStorage === null){
    todoItems=[];
  }
  else{
    todoItems = JSON.parse(todoStorage);
  }
  
  console.log("items", todoItems);  
  getList(todoItems);
}

// create a local storage
const setLocalStorage = function(todoItems){
  localStorage.setItem("todoItems", JSON.stringify(todoItems));
}

document.addEventListener("DOMContentLoaded", () =>{
  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const itemName = itemInput.value.trim();
    //add task into the array
    //if user input nothing give him a hint
    if(itemName.length ===0){
      //alert("Please Enter a task");
      alertMessage("Please enter name", "alert-danger");
    }
    else{
      //create a task into the list
      //判斷是要修改 還是要新增
      const currentItemIndex = document.querySelector("#objIndex").value;
      if(currentItemIndex){
        //update
        updateItem(currentItemIndex, itemName);
        document.querySelector("#objIndex").value = "";
        alertMessage("Item has been updated", "alert-success");
      }
      else{ 
        const itemObj ={
          name: itemName,
          isDone: false,
          addedAt: new Date().getTime(),
          isDelete: false
        };
        todoItems.push(itemObj);
        setLocalStorage(todoItems);
        //告知使用者
        alertMessage("New Item has been added", "alert-success");
      }
      getList(todoItems);
    } 
    // end of task adding
    itemInput.value = "";
  })
  getLocalStorage();
  console.log("getlocal");//執行時速度會比較慢! 可用print檢測
})