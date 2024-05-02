<script> 
    import Pie from '$lib/Pie.svelte';

    import { scaleLinear } from 'd3-scale';
 
    export let data;

    // Rescaling for mapping of cities on map
    const scaleX = scaleLinear().domain([-100,50]).range([0,800])
    const scaleY = scaleLinear().domain([30,60]).range([400,0])

    // Rescaling for colouring and radius of circles
    const scaleColour = scaleLinear().domain([0,17000]).range(["white","white"])
    const scaleRadius = scaleLinear().domain([0,17000]).range([0,40000])

    // Define slider default value
    let slider_value2 = 1704063600000;
  
    // Form value
    let data_type = "Sales";
    function onChange(event) {
      data_type = event.currentTarget.value;
	  }

    // Function to transform slider value (which is a numeric value) to date format
    $: getDate = function(slider_input) {
        let originalDate = new Date(slider_input)
        originalDate.setDate(1);
        originalDate.setHours(0);
        originalDate.setMinutes(0);
        originalDate.setSeconds(0);
        originalDate.setMilliseconds(0);
        let formattedDate = originalDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        return [formattedDate]
    }

    // Function to transform the date in the csv input file to numeric format in order to link the date of input file to the slider value
    $: getDateNumber = function(x) {
      let originalDate = new Date(x)
      originalDate.setDate(1);
      originalDate.setHours(0);
      originalDate.setMinutes(0);
      originalDate.setSeconds(0);
      originalDate.setMilliseconds(0);
      let dateNumber = Number(new Date(originalDate).getTime());
        return [dateNumber]
    }

    // Function to transform a number to date format
    $: getFullDate = function(input) {
        let originalDate = new Date(input)
        originalDate.setDate(1);
        originalDate.setHours(0);
        originalDate.setMinutes(0);
        originalDate.setSeconds(0);
        originalDate.setMilliseconds(0);
        let formattedDate = originalDate.toString();
        return [formattedDate]
    }

</script>


<style>
  .h1s {color:blue; 
            font-family:Arial; 
            text-align:left;
            opacity:0.7;
            font-size:25px;
  }  

  svg {
      border: 1px;
      border-style: solid;
  }

  text {
      text-align: left;
  }

  .slider {
    -webkit-appearance: none;
    width: 1200px;
    height: 10px;
    border-radius: 5px;
    background: #d3d3d3;
    outline: none;
    opacity: 0.7;
    -webkit-transition: .2s;
    transition: opacity .2s;
  }

  .slider:hover {
    opacity: 1;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 30px;
    height: 30px;
    border: 0;
    /* border-radius: 50%;
    background: black; */
    background-image: url('Battery.jpg');
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
    /* background-size: cover;  */
    cursor: pointer;
  }

  .slider::-moz-range-thumb {
    width: 23px;
    height: 24px;
    border: 0;
    /* border-radius: 50%;
    background: black; */
    background-image: url('Battery.jpg');
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
    /* background-size: cover; */
    cursor: pointer;
  }

  .slidecontainer {
  width: 100%;
  }

  .map {
    background-image: url('http://localhost:5173/EuropeMap15.png');
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
  }

  #tooltip {
    position: fixed;
    background-color: white;
    padding: 3px;
    border: solid 1px;
  }

  svg.tooltip {
    margin: 0px;
    padding: 0px;
  }

</style>


<!-- Return to home page button -->
  <!-- <a href="http://localhost:5173">
    <button>Return to home page</button>
  </a>
  <br><br> -->

<!-- Header -->
<h1 class="h1s">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
    Data Visualisation Project - Group 31: Implementation of Fig. 1</h1>
<br>

<!-- Data type selection -->
<p><u>Choose type of data:</u> &emsp;
<label><input checked={data_type==="Purchases"} on:change={onChange} type="radio" name="radio" value="Purchases" />Purchases</label>
<label><input checked={data_type==="Sales"} on:change={onChange} type="radio" name="radio" value="Sales" />Sales</label>
<label><input checked={data_type==="Forecast"} on:change={onChange} type="radio" name="radio" value="Forecast" />Forecast</label>
<label><input checked={data_type==="Inventory"} on:change={onChange} type="radio" name="radio" value="Inventory" />Inventory</label>
</p>
<br><br>

<!-- Slider for month-year -->
<div class="slidecontainer">
  <input type="range" min='1640991600000' max='1764543600000' bind:value={slider_value2} class="slider" id="myRange">
  <p style="margin-left: 550px;"><u>Slider value:</u> {getDate(slider_value2)}</p>
</div>
<br><br>

<!-- Graph for each data type (purchases, sales, forecast)-->
<!-- 1) Sales -->
{#if data_type == "Sales"}
  <svg class="map" width="1200" height="900">
    <!-- Legend -->
    <text x="25" y="25" style="text-decoration:underline;">Data type:</text>
    <text x="25" y="50" style="text-transform:uppercase">{data_type}</text>
    <text x="1050" y="25" style="text-decoration:underline;">Legend:</text>
    <rect x=1050 y=35 width=20 height=20 fill='#ffff00' opacity = 0.5 />
    <rect x=1050 y=35 width=20 height=20 fill='#0080ff' opacity = 0.5 />
    <rect x=1050 y=60 width=20 height=20 fill='#ffff00' opacity = 0.5 />
    <text x="1080" y="50">Car batteries</text>
    <text x="1080" y="75">Home batteries</text>
  
  <!-- Plotting of the pie charts for each plant -->
  {#each data.cities as datapoint}
    {#each data.inventory as invent}
      {#if invent.PlantKey == datapoint.PlantKey && Number(getDateNumber(invent.Inventory_Month)) == Number(getDateNumber(slider_value2)) && invent.MaterialKey == 1}
        <Pie 
          size={Math.sqrt(scaleRadius(invent.SalesQuantity_Total)/3.14)} 
          percent={invent.SalesQuantity_Pct} 
          testx={scaleX(datapoint.Longitude)}
          testy={scaleY(datapoint.Latitude)}
          style={"fill:" + scaleColour(invent.SalesQuantity_Total)}
          />
        <text 
          x={scaleX(datapoint.Longitude)-12}
          y={scaleY(datapoint.Latitude-0.4)}
          fill="black"
          font-size="15"
          >{invent.SalesQuantity_Total}
          <title>Total sales quantity: {invent.SalesQuantity_Total}
            Sales of car batteries: {invent.SalesQuantity}
            Sales of home batteries: {invent.SalesQuantity_Total - invent.SalesQuantity}
          </title>
        </text>
      {/if}

    {/each}
  {/each}
  </svg>
{/if}

<!-- 2) Forecast -->
{#if data_type == "Forecast"}
  <svg class="map" width="1200" height="900">
  <!-- Legend -->
    <text x="25" y="25" style="text-decoration:underline;">Data type:</text>
    <text x="25" y="50" style="text-transform:uppercase">{data_type}</text>
    <text x="1050" y="25" style="text-decoration:underline;">Legend:</text>
    <rect x=1050 y=35 width=20 height=20 fill='#ffff00' opacity = 0.5 />
    <rect x=1050 y=35 width=20 height=20 fill='#0080ff' opacity = 0.5 />
    <rect x=1050 y=60 width=20 height=20 fill='#ffff00' opacity = 0.5 />
    <text x="1080" y="50">Car batteries</text>
    <text x="1080" y="75">Home batteries</text>
  
  <!-- Plotting of the pie charts for each plant -->
  {#each data.cities as datapoint}
    {#each data.inventory as invent}
      {#if invent.PlantKey == datapoint.PlantKey && Number(getDateNumber(invent.Inventory_Month)) == Number(getDateNumber(slider_value2)) && invent.MaterialKey == 1}
        <Pie 
          size={Math.sqrt(scaleRadius(invent.ForecastQuantity_Total)/3.14)} 
          percent={invent.ForecastQuantity_Pct} 
          testx={scaleX(datapoint.Longitude)}
          testy={scaleY(datapoint.Latitude)}
          style={"fill:" + scaleColour(invent.ForecastQuantity_Total)}
          />
        <text 
          x={scaleX(datapoint.Longitude)-12}
          y={scaleY(datapoint.Latitude-0.4)}
          fill="black"
          font-size="15"
          >{invent.ForecastQuantity_Total}
          <title>Total forecast quantity: {invent.ForecastQuantity_Total}
            Sales of car batteries: {invent.ForecastQuantity}
            Sales of home batteries: {invent.ForecastQuantity_Total - invent.ForecastQuantity}
          </title>
        </text>
      {/if}
    {/each}  
  {/each}
  </svg>
{/if}

<!-- 3) Purchases -->
{#if data_type == "Purchases"}
  <svg class="map" width="1200" height="900">
  <!-- Legend -->
    <text x="25" y="25" style="text-decoration:underline;">Data type:</text>
    <text x="25" y="50" style="text-transform:uppercase">{data_type}</text>
    <text x="1050" y="25" style="text-decoration:underline;">Legend:</text>
    <rect x=1050 y=35 width=20 height=20 fill='#ffff00' opacity = 0.5 />
    <rect x=1050 y=35 width=20 height=20 fill='#0080ff' opacity = 0.5 />
    <rect x=1050 y=60 width=20 height=20 fill='#ffff00' opacity = 0.5 />
    <text x="1080" y="50">Car batteries</text>
    <text x="1080" y="75">Home batteries</text>
  
  <!-- Plotting of the pie charts for each plant -->
  {#each data.cities as datapoint}
    {#each data.inventory as invent}
      {#if invent.PlantKey == datapoint.PlantKey && Number(getDateNumber(invent.Inventory_Month)) == Number(getDateNumber(slider_value2)) && invent.MaterialKey == 1}
        <Pie 
          size={Math.sqrt(scaleRadius(invent.ForecastQuantity_Total)/3.14)} 
          percent={invent.ForecastQuantity_Pct} 
          testx={scaleX(datapoint.Longitude)}
          testy={scaleY(datapoint.Latitude)}
          style={"fill:" + scaleColour(invent.ForecastQuantity_Total)}
          />
        <text 
          x={scaleX(datapoint.Longitude)-12}
          y={scaleY(datapoint.Latitude-0.4)}
          fill="black"
          font-size="15"
          >{invent.PurchaseQuantity_Total}
          <title>Total purchase quantity: {invent.PurchaseQuantity_Total}
            Sales of car batteries: {invent.PurchaseQuantity}
            Sales of home batteries: {invent.PurchaseQuantity_Total - invent.PurchaseQuantity}
          </title>
        </text>
      {/if}
    {/each}  
  {/each}
  </svg>
{/if}

<!-- 4) Inventory -->
{#if data_type == "Inventory"}
  <svg class="map" width="1200" height="900">
  <!-- Legend -->
    <text x="25" y="25" style="text-decoration:underline;">Data type:</text>
    <text x="25" y="50" style="text-transform:uppercase">{data_type}</text>
    <text x="1050" y="25" style="text-decoration:underline;">Legend:</text>
    <rect x=1050 y=35 width=20 height=20 fill='#ffff00' opacity = 0.5 />
    <rect x=1050 y=35 width=20 height=20 fill='#0080ff' opacity = 0.5 />
    <rect x=1050 y=60 width=20 height=20 fill='#ffff00' opacity = 0.5 />
    <text x="1080" y="50">Car batteries</text>
    <text x="1080" y="75">Home batteries</text>
  
  <!-- Plotting of the pie charts for each plant -->
  {#each data.cities as datapoint}
    {#each data.inventory as invent}
      {#if invent.PlantKey == datapoint.PlantKey && Number(getDateNumber(invent.Inventory_Month)) == Number(getDateNumber(slider_value2)) && invent.MaterialKey == 1}
        <Pie 
          size={Math.sqrt(scaleRadius(invent.OnShelfInventoryQuantity_Total)/3.14)} 
          percent={invent.OnShelfInventoryQuantity_Pct} 
          testx={scaleX(datapoint.Longitude)}
          testy={scaleY(datapoint.Latitude)}
          style={"fill:" + scaleColour(invent.OnShelfInventoryQuantity_Total)}
          />
        <text 
          x={scaleX(datapoint.Longitude)-12}
          y={scaleY(datapoint.Latitude-0.4)}
          fill="black"
          font-size="15"
          >{invent.OnShelfInventoryQuantity_Total}
          <title>Total on shelf inventory quantity: {invent.OnShelfInventoryQuantity_Total}
            Sales of car batteries: {invent.OnShelfInventoryQuantity}
            Sales of home batteries: {invent.OnShelfInventoryQuantity_Total - invent.OnShelfInventoryQuantity}
          </title>
        </text>
      {/if}
    {/each}  
  {/each}
  </svg>
{/if}