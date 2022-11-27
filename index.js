/*
variables name convention--

box= This variable contains all the boxes like Html, css, junior, frontend to which filter can be applied
filter= it represents the container showing all the filters currently applied.
filteredBody = This variable represents the main container containing all the filtered jobs
mainBody=without filter applied container variable
inFilterArea= this array will keep track of all the filtered currently applied and removed.
toremoveBox = this will contain all the boxes from the filtered body jobs and it contains the element to which filter can be applied
*/

// this IIFE will immediately populate main Body with all the jobs available
(async () => {
  const response = await fetch('data.json');
  const data = await response.json();
  displayAllJobs(data)
})();

const body = document.querySelector('body');
let originalBody=[];   // it will contan all the jobs available
let inFilterArea = [];

//listen for any click event

body.addEventListener('click', (e) => {
  const filter=document.querySelector('.filter')
  const removeFilterCrossIcon = document.querySelectorAll('.filter .box img');
  const clear = document.querySelector('.clear')
  const box = document.querySelectorAll('.job-type > .box');

 //if user applied a filter
  box.forEach(element => {
    if (element.contains(e.target)) {
      filter.style.display="flex";
      addToFilterArea(e, inFilterArea);  // this function to show all the filtered jobs applied
    }
  });

  //when user removes a filter applied
  removeFilterCrossIcon.forEach((element) => {
    if (element.contains(e.target))
      removeFilter(e, inFilterArea)
  })

  // if user wants to clear all filter
  if (clear.contains(e.target)) {
    clearAllFilter();
  }
})

//this function will immedialtely populate all the jobs initially
function displayAllJobs(data) {
  const mainBody = document.querySelector('.main-body');
  for (let i = 0; i <= 10; i++) {
    let languages = "";
    for (let j = 0; j < data[i].languages.length; j++) {
      languages = languages + "<div  class=" + "box" + ">" + `${data[i].languages[j]}` + "</div>";
    }
    let tools = "";
    for (let j = 0; j < data[i].tools.length; j++) {
      tools = tools + "<div  class=" + "box" + ">" + `${data[i].tools[j]}` + "</div>";
    }
    const div = document.createElement('div');
    div.setAttribute('class', 'job flex')
    div.setAttribute('id', `${data[i].id}`)
    div.innerHTML = `
    <div class="company-logo">
    <img src=${data[i].logo} alt="" class="src">
  </div>
  <div class="company-info">
    <div class="company-name-features">
      <div class="company-name primary bold">
        <p>${data[i].company}</p>
      </div>
    </div>
  
    <div class="position bold">
      <p>${data[i].position}
      <p>
    </div>
    <div class="date-contract-location flex primary">
      <div class="posted-at">
        ${data[i].postedAt}
      </div>
      <div class="contract">
        ${data[i].contract}
      </div>
      <div class="location">
        ${data[i].location}
      </div>
    </div>
  </div>
  <div class="job-type flex primary bold">
    <div class="box">${data[i].role}</div>
    <div class="box">${data[i].level}</div>
    ${languages}
    ${tools}
  </div>
  
  </div>`
    mainBody.append(div);
   originalBody.push(div);
  } 
}

// function to remove all the filter applied
function clearAllFilter(){
  inFilterArea=[];
  const filteredBody = document.querySelector('.filtered-body')
  const filter=document.querySelector('.filter')
  const mainBody = document.querySelector('.main-body');
  filteredBody.textContent="";
  mainBody.textContent="";
  originalBody.forEach(element=>{
    mainBody.append(element)
  })
  filter.textContent="";
  filter.innerHTML=`
  <div class="clear primary bold">clear</div>
  `
  filter.style.display="none"
  mainBody.style.display="";
}

//function to remove a single filter
function removeFilter(e, inFilterArea) {
  const mainBody = document.querySelector('.main-body');
  const toremoveBox = document.querySelectorAll('.filtered-body  .job  .job-type .box');
  const text = e.target.parentElement.innerText
  let jobArr = [];
  toremoveBox.forEach(element => {
    if (`${element.innerText}` === `${e.target.parentElement.innerText}`) {
      const job = element.parentElement.parentElement;

      if (jobArr.indexOf(job) == -1)
        jobArr.push(job);
    }
  })
  jobArr.forEach(element => {
    mainBody.append(element);
  })
  let index = inFilterArea.indexOf(`${text}`);
  inFilterArea.splice(index, 1)
  e.target.parentElement.parentElement.remove();
  if (inFilterArea.length == 0) {
    clearAllFilter();
  }
}



//this function will apply filter and display all the filter jobs to user
function addToFilterArea(e, inFilterArea) {
  // if filter is already applied and user applied for same filter then return 
  if (inFilterArea.indexOf(e.target.textContent) >= 0)
    return;
  else
    inFilterArea.push(e.target.textContent)
  const filterArea = document.querySelector('.filter');
  const filterAreaBox = document.querySelectorAll('.filter > div > .box')
  const tofilter = document.querySelectorAll('.job .box')
  //starting of new code
  // insert in the filter showing container
  const div = document.createElement('div');

  div.innerHTML = `
    <div class="box flex">
    ${e.target.textContent}
    <img src="./images/icon-remove.svg" alt="" class="src">
    </div>`
  filterArea.prepend(div)

  // insert in the main body all the filtered jobs
  const filteredBody = document.querySelector('.filtered-body')
  const mainBody = document.querySelector('.main-body')
  mainBody.style.display = 'none'
  originalBody.forEach(element =>{
    const box=element.querySelectorAll('.box');
    box.forEach(boxElement=>{
         if(boxElement.textContent === e.target.textContent)
              filteredBody.prepend(element);
    })
  })
}
