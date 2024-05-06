let Title= document.getElementById("Title")
let Price= document.getElementById("Price")
let Tax= document.getElementById("Tax")
let Ads= document.getElementById("Ads")
let Discount= document.getElementById("Discount")
let total= document.getElementById("total")
let Count= document.getElementById("Count")
let Category= document.getElementById("Category")
let Create = document.querySelector(".Create")
let mood ="create"
let tmp;
 

// get total 
function getTotal(){
if( Price.value !=""){
let result =   (+Price.value + +Tax.value + +Ads.value ) - +Discount.value
total.innerHTML= result;
total.style.background="green"

 }
 else{
  total.innerHTML= " ";
total.style.background="#1f2641"
 }
}
 

// create data 
let dataPro  ;


if (localStorage.getItem("product") !== null) {
  dataPro = JSON.parse(localStorage.getItem("product"));
} else {
  dataPro = [];
}


Create.onclick =function(){
  let newData={
    Title : Title.value.toLowerCase(),
    Tax : Tax.value,
    Ads : Ads.value,
    Discount : Discount.value,
    total : total.innerHTML,
    Count : Count.value,
    Category : Category.value.toLowerCase(),
  }
  if(Title.value !="" && Price.value !="" &&
   Category.value !=""){ 
if(mood === "create"){

 
  if(newData.Count > 1 && newData.Count <100){
    for(let i=0 ; i<newData.Count ; i++){
dataPro.push(newData);


    }
  }else{
    dataPro.push(newData)
  }

}else{
  dataPro[tmp]=newData;
  mood="create";
  Create.innerHTML="Create";
  Count.style.display="block"
}
clearInput();
  }

// save localstorage 
localStorage.setItem( "product", JSON.stringify(dataPro))
console.log(dataPro);

 
readData()
}

//  clear input 
function clearInput(){
  Title.value= "";
  Price.value= "";
  Tax.value= "";
  Ads.value= "";
  Discount.value= "";
  total.innerHTML= "";
  Count.value= "";
  Category.value= "";
}

readData()

// read data 
function readData(){
getTotal();
  let table ="";
  for(let  i=0 ; i < dataPro.length ; i++){
    table +=`
    
    <tr>
    <td>${i+1}</td>
    <td>${dataPro[i].Title}</td>
    <td>${dataPro[i].Price}</td>
    <td>${dataPro[i].Tax}</td>
    <td>${dataPro[i].Ads}</td>
    <td>${dataPro[i].Discount}</td>
    <td>${dataPro[i].total}</td>
    <td>${dataPro[i].Category}</td>
    <td>
        <button onclick="updateDate(${i})"  class="btn btn-primary">Update</button>
        <button onclick=" delteData(${ i })"  class="btn btn-danger">Delete</button>
    </td>
</tr>`
  }
    

  document.getElementById("tbody").innerHTML= table;


let btnDeleteAll= document.getElementById("deleteAll")
  if(dataPro.length >0 ){
  btnDeleteAll.innerHTML= `
  <div  onclick="deleteAll()" >deleteAll (${dataPro.length})</div>`
  }else{
    btnDeleteAll.innerHTML= ""
  }
}

// delete
function delteData(i){
      dataPro.splice(i,1);
      localStorage.product = JSON.stringify(dataPro)
      readData()
}

function deleteAll(){
  localStorage.clear();
  dataPro.splice(0)
readData()
}


// count 

function updateDate(i){
  Title.value = dataPro[i].Title;
  Price.value = dataPro[i].Price;
  Tax.value = dataPro[i].Tax;
  Ads.value = dataPro[i].Ads;
  Discount.value = dataPro[i].Discount;
  Count.style.display = "none";
  Category.value = dataPro[i].Category;
  Create.innerHTML = "Update";
  mood = "update";
  tmp = i;
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// search 
let searchMood="title";
let searchh =document.getElementById("search")
function search(id){
  if(id == "SearchByTitle"){
    searchMood = "title";
    searchh.placeholder = "Search By Title";
  } else {
    searchMood = "category";
    searchh.placeholder = "Search By Category";
  }
  searchh.focus();
  searchh.value = "";
  readData();
}



function searchData(value){


if( searchMood == "title" ){
         let table="";       
      for( let i=0 ; i< dataPro.length ; i++){
        if(dataPro[i].Title.includes(value.toLowerCase())){


          table +=`
    
          <tr>
          <td>${i+1}</td>
          <td>${dataPro[i].Title}</td>
          <td>${dataPro[i].Price}</td>
          <td>${dataPro[i].Tax}</td>
          <td>${dataPro[i].Ads}</td>
          <td>${dataPro[i].Discount}</td>
          <td>${dataPro[i].total}</td>
          <td>${dataPro[i].Category}</td>
          <td>
              <button onclick="updateDate(${i})"  class="btn btn-primary">Update</button>
              <button onclick=" delteData(${ i })"  class="btn btn-danger">Delete</button>
          </td>
      </tr>`

        }
      }
}
else{
  for( let i=0 ; i< dataPro.length ; i++){
    if(dataPro[i].Category.includes(value.toLowerCase())){


      table +=`

      <tr>
      <td>${i+1}</td>
      <td>${dataPro[i].Title}</td>
      <td>${dataPro[i].Price}</td>
      <td>${dataPro[i].Tax}</td>
      <td>${dataPro[i].Ads}</td>
      <td>${dataPro[i].Discount}</td>
      <td>${dataPro[i].total}</td>
      <td>${dataPro[i].Category}</td>
      <td>
          <button onclick="updateDate(${i})"  class="btn btn-primary">Update</button>
          <button onclick=" delteData(${ i })"  class="btn btn-danger">Delete</button>
      </td>
  </tr>`

    }
  }
}
document.getElementById("tbody").innerHTML= table;


}


// clear data 














