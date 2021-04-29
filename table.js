$(document).ready(function() {
    //get json data from the url
    $.getJSON("https://api.covid19india.org/data.json", function (data) {
        var states = [];
        var confirmed = [];
        var recovered = [];
        var deaths = [];

        var total_active;
        var total_confirmed;
        var total_recovered;
        var total_deaths;
        
        total_active= data.statewise[0].active;
        total_confirmed= data.statewise[0].confirmed;
        total_recovered= data.statewise[0].recovered;
        total_deaths= data.statewise[0].deaths;

        //increased cases
        var increased_active;
        var increased_confirmed;
        var increased_recovered;
        var increased_deaths;
        
        increased_confirmed= data.statewise[0].deltaconfirmed;
        increased_recovered= data.statewise[0].deltarecovered;
        increased_deaths= data.statewise[0].deltadeaths;
        increased_active=increased_confirmed-increased_recovered-increased_deaths;

        if(increased_active<0)
        increased_active="0";
        if(increased_confirmed<0)
        increased_confirmed="0";
        if(increased_recovered<0)
        increased_recovered="0";
        if(increased_deaths<0)
        increased_deaths="0";
        
        // Intl.NumberFormat().format(total_confirmed)-for converting 1255 to 1,255

        
        $("#confirmed").append(Intl.NumberFormat().format(total_confirmed));
        $("#active").append(Intl.NumberFormat().format(total_active));
        $("#recovered").append(Intl.NumberFormat().format(total_recovered));
        $("#deaths").append(Intl.NumberFormat().format(total_deaths));

        if(increased_active!="0"){
        $("#iactive").append(Intl.NumberFormat().format(increased_active));}
        else{
            var img = document.createElement("img");
            img.src = "images/heart-act.svg";
            var src = document.getElementById("iactive");
            src.appendChild(img);}

        if(increased_confirmed!="0"){
        $("#iconfirmed").append(Intl.NumberFormat().format(increased_confirmed));}
        else{
            var img = document.createElement("img");
            img.src = "images/heart-conf.svg";
            var src = document.getElementById("iconfirmed");
            src.appendChild(img);}

        if(increased_recovered!="0"){
        $("#irecovered").append(Intl.NumberFormat().format(increased_recovered));}
        else{
            var img = document.createElement("img");
            img.src = "images/heart-rec.svg";
            var src = document.getElementById("irecovered");
            src.appendChild(img);}

        if(increased_deaths!="0"){
        $("#ideaths").append(Intl.NumberFormat().format(increased_deaths));}
        else{
        var img = document.createElement("img");
        img.src = "images/heart-deaths.svg";
        var src = document.getElementById("ideaths");
        src.appendChild(img);}

        // The each loop select a single statewise array element
        // Take the data in that array and add it to variables
        $.each(data.statewise, function(id,obj) {
            states.push(obj.state);
            confirmed.push(obj.confirmed);
            recovered.push(obj.recovered);
            deaths.push(obj.deaths);
        });
        // Remove the first element in the states, confirmed, recovered, and deaths as that is the total value
        states.shift();
        confirmed.shift();
        recovered.shift();
        deaths.shift();

        data.statewise.shift();
        var pp=data.statewise.length-1;
        data.statewise.splice(pp,1);
        

        data.statewise.sort(function(a, b){return a-b}); 
        // for searching any state
        $('#search-input').on('keyup', function(){
            var valu = $(this).val()
            var dat =  searchTable(valu,data.statewise)
            buildTable(dat)
        })
       
        buildTable(data.statewise)
       
        function searchTable(valu,dat){
            var filteredData =[];
            for(var i=0;i<dat.length;i++)
            {
                valu=valu.toLowerCase()
                var name =dat[i].state.toLowerCase()
                
                if(name.includes(valu))
                {
                    filteredData.push(dat[i])
                    
                }
            }
            return filteredData
        }
        //building the table
        function buildTable(value){
            var table = document.getElementById('mytable')
            table.innerHTML ='' //for searching
            for(var i=0; i < value.length; i++)
            {
                var deltaact=value[i].deltaconfirmed-value[i].deltarecovered-value[i].deltadeaths;
                if(deltaact<0)
                deltaact="0";
                
                var row = `<tr>
                                <td>${value[i].state}</td>
                                <td>
                                
                                <span class="delconf" style="color: #ff073a;">
                                <small><i class="fas fa-arrow-up"></i></small>
                                ${Intl.NumberFormat().format(value[i].deltaconfirmed)}
                                </span>
                                ${Intl.NumberFormat().format(value[i].confirmed)}
                                </td>
                                
                                <td>
                                <span class="delact" style="color: #0080ff;">
                                <small><i class="fas fa-arrow-up"></i></small>
                                ${Intl.NumberFormat().format(deltaact)}
                                </span>
                                ${Intl.NumberFormat().format(value[i].active)}</td>
                                <td>
                                <span class="delrec" style="color: #009970;">
                                <small><i class="fas fa-arrow-up"></i></small>
                                ${Intl.NumberFormat().format(value[i].deltarecovered)}
                                </span>
                                ${Intl.NumberFormat().format(value[i].recovered)}
                                </td>
                                <td>
                                <span class="deldeath" style="color: #4d4d4d;">
                                <small><i class="fas fa-arrow-up"></i></small>
                                ${Intl.NumberFormat().format(value[i].deltadeaths)}
                                </span>
                                ${Intl.NumberFormat().format(value[i].deaths)}
                                </td>
                                <td>
                                ${parseInt(value[i].confirmed)}
                                </td>
                            </tr>`
                            table.innerHTML += row
            }
                        
                            sortTableByColumn(document.querySelector("table"),5,false);
                            //removing the last column
                            $('table tr').find('td:eq(5),th:eq(5)').remove();
                                        
        }

     // for charts
     var date=[];
     var chartconfirmed=[];
     var chartrecovered=[];
     var chartdeaths=[];

     var n=data.cases_time_series.length;
     for(var k= n-30; k<n-1 ;k+=7)
     {
         date.push(data.cases_time_series[k].date);
         chartconfirmed.push(data.cases_time_series[k].totalconfirmed);
         chartrecovered.push(data.cases_time_series[k].totalrecovered);
         chartdeaths.push(data.cases_time_series[k].totaldeceased);
         
     }
     date.push(data.cases_time_series[n-1].date);
         chartconfirmed.push(data.cases_time_series[n-1].totalconfirmed);
         chartrecovered.push(data.cases_time_series[n-1].totalrecovered);
         chartdeaths.push(data.cases_time_series[n-1].totaldeceased);
     
       
     var mychart= document.getElementById("myChart").getContext('2d');
     var chart=new Chart(mychart,{
         type:'line',
        
         data: {
             labels: date,
             
             datasets:[{
                 label: "confirmed",
                 data: chartconfirmed,
                 fill: false,
                 backgroundColor:"rgba(255, 7, 58, 0.8)",
                 borderColor:"rgba(255, 7, 58, 0.314)",
             }],
         },
         
         options: {
             legend: {
                 display:false,
             } ,
             tooltips: { 
                
                callbacks: { 
                    label: function(tooltipItem, data) { 
                        return tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }, }, 
             }, 
             scales: {
                 xAxes: [{
                   
                                         
                     ticks: {
                         
                         fontColor: "rgba(255, 7, 58, 0.8)",
                     },
                     gridLines: {
                    
                        drawOnChartArea:false,
                        
                        color:"rgba(255, 7, 58, 0.8)",
                         
                       }
                    }],
                 yAxes: [{
                     position: 'right',
                     
                     ticks: {
                         stepSize: 50000,
                         fontColor: "rgba(255, 7, 58, 0.8)",
                         userCallback: function(value, index, values) {
                            return value.toLocaleString();   // this is all we need for comma separated numbers
                        }
                     },
                     gridLines: {
                        drawOnChartArea:false,
                        color:"rgba(255, 7, 58, 0.8)",
                         
                       }
                    }]
             },
         }
     });
     var mychart1= document.getElementById("myChart1").getContext('2d');
     var chart=new Chart(mychart1,{
         type:'line',
        
         data: {
             labels: date,
             
             datasets:[{
                 label: "Recovered",
                 data: chartrecovered,
                 fill: false,
                 backgroundColor:"rgba(40, 167, 69,0.8)",
                 borderColor:"rgba(40, 167, 69,0.314)",
             }],
         },
         
         options: {
             legend: {
                 display:false,
             } ,
             tooltips: { 
                
                callbacks: { 
                    label: function(tooltipItem, data) { 
                        return tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }, }, 
             }, 
             scales: {
                 xAxes: [{
                   
                                         
                     ticks: {
                         
                         fontColor: "rgba(40, 167, 69,0.8)",
                     },
                     gridLines: {
                        drawOnChartArea:false,
                        color:"rgba(40, 167, 69, 0.8)",
                       }
                    }],
                 yAxes: [{
                     position: 'right',
                     
                     ticks: {
                         stepSize: 50000,
                         fontColor: "rgba(40, 167, 69,0.8)",
                         userCallback: function(value, index, values) {
                            return value.toLocaleString();   // this is all we need for comma separated numbers
                        }
                     },
                     gridLines: {
                        drawOnChartArea:false,
                        color:"rgba(40, 167, 69, 0.8)",
                       }
                    }]
             },
         }
     });
     var mychart2= document.getElementById("myChart2").getContext('2d');
     var chart=new Chart(mychart2,{
         type:'line',
        
         data: {
             labels: date,
             
             datasets:[{
                 label: "Deaths",
                 data: chartdeaths,
                 fill: false,
                 backgroundColor:"rgb(108, 117, 125)",
                 borderColor:"rgba(108, 117, 125,0.314)",
             }],
         },
         
         options: {
             legend: {
                 display:false,
             } ,
             tooltips: { 
                
                callbacks: { 
                    label: function(tooltipItem, data) { 
                        return tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }, }, 
             }, 
             scales: {
                 xAxes: [{
                   
                                         
                     ticks: {
                         
                         fontColor: "rgb(108, 117, 125)",
                     },
                     gridLines: {
                        drawOnChartArea:false,
                        color:"rgba(108,117,125,0.8)",
                       }
                    }],
                 yAxes: [{
                     position: 'right',
                     
                     ticks: {
                         stepSize: 5000,
                         fontColor: "rgb(108, 117, 125)",
                         userCallback: function(value, index, values) {
                            return value.toLocaleString();   // this is all we need for comma separated numbers
                        }
                     },
                     gridLines: {
                        drawOnChartArea:false,
                        color:"rgba(108,117,125, 0.8)",
                       }
                    }]
             },
         }
     });


        /**
 * Sorts a HTML table.
 * 
 * @param {HTMLTableElement} table The table to sort
 * @param {number} column The index of the column to sort
 * @param {boolean} asc Determines if the sorting will be in ascending
 */
function sortTableByColumn(table, column, asc = true) {
    const dirModifier = asc ? 1 : -1;
    const tBody = table.tBodies[0];
    const rows = Array.from(tBody.querySelectorAll("tr"));

    // Sort each row
    const sortedRows = rows.sort((a, b) => {
        const aColText = a.querySelector(`td:nth-child(${ column + 1 })`).textContent.trim();
        const bColText = b.querySelector(`td:nth-child(${ column + 1 })`).textContent.trim();

        return parseInt(aColText) > parseInt(bColText) ? (1 * dirModifier) : (-1 * dirModifier);
    });

    // Remove all existing TRs from the table
    while (tBody.firstChild) {
        tBody.removeChild(tBody.firstChild);
    }

    // Re-add the newly sorted rows
    tBody.append(...sortedRows);
    
    
}

    });
});
