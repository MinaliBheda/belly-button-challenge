// Get the url
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
  
});
//On page load Initialization
function init()
{
    d3.json(url).then(function(data) 
    {
        //Get selDataset from index.html
        let options = d3.select("#selDataset");
        
        //Get the Names
        let names = data.names;
        console.log("Names:" , names);
        
        //Adding values in the dropdown box
        for(let i = 0 ; i < names.length;i++)
        {
            options.append("option").text(names[i]).attr("value",names[i]);
        }
        
        //Initialize Charts
        plotbargraph(names[0]);
        plotbubblechart(names[0]);
        demographic_info(names[0]);
    });
}

//On change Dataset update Charts

d3.selectAll("#selDataset").on("change", updatePlotly);

function updatePlotly()
{
    let dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    let select_id = dropdownMenu.property("value");
    console.log("Menu Selected:" , select_id);

    plotbargraph(select_id);
    plotbubblechart(select_id);
    demographic_info(select_id);

}

// Plot Bar Graph for Selected option
function plotbargraph (sample_id)
{
    d3.json(url).then(function(data) 
    {
        //Get the Sample Data
        let sample_data = data.samples;
        console.log("Data",sample_data);
        //Get the Sample Values
        let values = sample_data.filter(result => result.id == sample_id);
        console.log("Values:",values);
        //Get the OTU IDS
        let otu_ids = values[0].otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        console.log("OTU_ids", otu_ids);
        //Get the OTU values
        let otu_values = values[0].sample_values.slice(0,10).reverse();
        console.log("OTU_values", otu_values);
        //Get the OTU labels
        let otu_labels = values[0].otu_labels.slice(0,10).reverse();
        console.log("OTU_labels", otu_labels);
        //Create Trace
        let trace1 = {
            x: otu_values,
            y: otu_ids,
            text: otu_labels,
            type: "bar",
            orientation: "h"
          };
          //Create Layout
        let layout = {
            title : `Top 10 OTU's found in the Individual ${sample_id}`
        };  
        
        let chart_data = [trace1];
        
        //Plot Bar Chart
        Plotly.newPlot("bar", chart_data,layout);

    });
}

//Plot Bubble Chart For selected option
function plotbubblechart (sample_id)
{
    d3.json(url).then(function(data) 
    {
        let sample_data = data.samples;
        console.log("Data",sample_data);
        let values = sample_data.filter(result => result.id == sample_id);
        console.log("Values:",values);
        let otu_ids = values[0].otu_ids;
        console.log("OTU_ids", otu_ids);
        let otu_values = values[0].sample_values;
        console.log("OTU_values", otu_values);
        let otu_labels = values[0].otu_labels;
        console.log("OTU_labels", otu_labels);
        let trace2 = {
            x: otu_ids,
            y: otu_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                color: otu_ids,
                opacity: [1, 0.8, 0.6, 0.4],
                size: otu_values
            }
          };
        let layout = {
            title : `Top 10 OTU's found in the Individual ${sample_id}`,
            xaxis: {title: "OTU ID"}

        };  
        let chart_data1 = [trace2];
        //Plot
        Plotly.newPlot("bubble", chart_data1,layout);
    
    });
}
//Get the Demographic data
function demographic_info(sample_id)
{
    d3.json(url).then(function(data) 
    {
        let info = data.metadata;
        console.log(info);

        let values = info.filter(result => result.id == sample_id);
        console.log("Values:",values);

        //Get the meta Data
        let meta_data = values[0];
        console.log("meta_data:",meta_data);
        //Get the entries from the object
        let entries = Object.entries(meta_data);
        console.log("entries:",entries);
       //Get the Key-Value Pair to display
        let key_values = entries.map( ([key, val]) => {
             return `${key} : ${val}`;  
            });

        console.log(key_values);
        //Clear the frame before changing the option
        d3.select("#sample-metadata").html("");
        //Add to the sample metadata for display    
        for(let i = 0 ;i<key_values.length;i++)
        {
            console.log("KeyValue Pair:",key_values[i]);
            d3.select("#sample-metadata").append("h5").text(`${key_values[i]}`)
        }
        //Get the Wash Freq to plot Gauge Chart
        let freq = meta_data.wfreq;
        console.log("WFreq:",freq);
        //Plot Gauge Chart
        plotgaugechart(freq);

    });
}
//Plot Gauge Chart
function plotgaugechart(wash_freq)
{
    d3.json(url).then(function(data)
    {
        //Get the data
        let gauge_data = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: wash_freq,
                title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week" },
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis: {range: [0,10], tickmode: "linear", tick0: 2, dtick: 2},
                    steps: [
                        {range: [0, 1], color: "rgba(255, 255, 255, 0)"},
                        {range: [1, 2], color: "rgba(232, 226, 202, .5)"},
                        {range: [2, 3], color: "rgba(210, 206, 145, .5)"},
                        {range: [3, 4], color:  "rgba(202, 209, 95, .5)"},
                        {range: [4, 5], color:  "rgba(184, 205, 68, .5)"},
                        {range: [5, 6], color: "rgba(170, 202, 42, .5)"},
                        {range: [6, 7], color: "rgba(142, 178, 35 , .5)"},
                        {range: [7, 8], color:  "rgba(110, 154, 22, .5)"},
                        {range: [8, 9], color: "rgba(50, 143, 10, 0.5)"},
                        {range: [9, 10], color: "rgba(14, 127, 0, .5)"},
                    ],
                    
                } ,
                
                
            }
        ];
        //Set  the Layout
        let layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
        //Plot The Gauge Chart
        Plotly.newPlot('gauge', gauge_data, layout);
    });
}
//Initialise on Page load
init();

