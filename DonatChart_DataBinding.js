var getScriptPromisify = (src) => {
  return new Promise(resolve => {
    $.getScript(src, resolve)
  })
  }
  
  (function () {
  
  //Chart Block in HTML Darshan Savani
  const prepared = document.createElement('template')
  prepared.innerHTML = `
  <style>
  </style>
  <div id="root" style="width: 100%; height: 100%;">
  </div>
    `
  //Main JS Class holds methods to be called
  class SamplePrepared extends HTMLElement {
    constructor() {
  
      //call SAC DOM Super method to get shadow DOM information
      super()
  
      //Get shadow DOM informations
      this._shadowRoot = this.attachShadow({ mode: 'open' })
      this._shadowRoot.appendChild(prepared.content.cloneNode(true))
  
      //Set HTML block in shadow DOM of SAC
      this._root = this._shadowRoot.getElementById('root')
  
      //_props object is used to hold properties infosrmation
      this._props = {}
  
      //Call render() method to plot chart
      this.render()
  
    }
  
    onCustomWidgetResize (width, height) {
      this.render()
    }
  
    //render() method to plot chart - resultSet1 holds data from SAC table/chart.
    set myDataSource (dataBinding) {
      this._myDataSource = dataBinding
      this.render()
    }
  
    async render() {
      await getScriptPromisify('https://cdn.amcharts.com/lib/4/core.js');
      await getScriptPromisify('https://cdn.amcharts.com/lib/4/themes/animated.js');
      await getScriptPromisify('https://cdn.amcharts.com/lib/4/charts.js');
  
      if (!this._myDataSource || this._myDataSource.state !== 'success') {
          return
        }
  
        const dimension = this._myDataSource.metadata.feeds.dimensions.values[0]
        const measure = this._myDataSource.metadata.feeds.measures.values[0]
        const data = this._myDataSource.data.map(data => {
          return {
            name: data[dimension].label,
            value: data[measure].raw
          }
        })
  
  
      console.log(data);
      // Themes begin
      am4core.useTheme(am4themes_animated);
      // Themes end
  
      var chart = am4core.create(this._root, am4charts.PieChart3D);
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
  
      chart.legend = new am4charts.Legend();
  
      chart.data =  data;
    
      chart.innerRadius = 100;
  
      var series = chart.series.push(new am4charts.PieSeries3D());
      series.dataFields.value = "value";
      series.dataFields.category = "name";
      console.log(series.dataFields.value);
      
      series.slices.template.events.on("hit", function(ev) {
  var series1 = ev.target.dataItem.value;
  var series2 = ev.target.dataItem.category;
  console.log(series1);
  console.log(series2);
        
  });
  
    }
  }
  customElements.define('com-sap-sample-donut-prepared', SamplePrepared)
  })()
  
