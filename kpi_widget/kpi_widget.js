var getScriptPromisify = (src) => {
  return new Promise(resolve => {
    $.getScript(src, resolve)
  })
}

(function () {
  const prepared = document.createElement('template')
  prepared.innerHTML = `
      <style>
      #root {
        width: 100%;
        height:400px;
      }
      .card {
        display: inline-block;
        width: 200px;
        height: 100px;
        border-radius: 30px;
        padding: 20px;
        margin: 20px;
        background: rgb(0,255,175);
      background: linear-gradient(176deg, rgba(0,255,175,1) 0%, rgba(0,212,255,1) 69%);
      box-shadow: 5px 5px 10px #dbdbdb;
      }

      .title {
          color:white;
          font-size: 20px;
          margin-bottom: 5px;
          margin-top: -8px;
          font-style: italic;
      }

      .value {
          color: white;
          font-size: 30px;
          margin-top: 10px;
      }

      .per{
          padding: 5px;
          background-color: white;
          border-radius: 30px;
      }
      </style>
      <div class="card" id="card1">
      <p class="title">Current Month</p>
      <h3 class="value" id="value1"></h3>
      <span class="per" id="percentage1"></span></p>
    </div>
    <div class="card" id="card2">
      <p class="title">Last Month</p>
      <h3 class="value" id="value2"></h3>
      <span class="per" id="percentage2"></span></p>
    </div>
      <div id="root">
      </div>
    `
  class SamplePrepared extends HTMLElement {
    constructor() {
      super()

      this._shadowRoot = this.attachShadow({
        mode: 'open'
      })
      this._shadowRoot.appendChild(prepared.content.cloneNode(true))

      this._root = this._shadowRoot.getElementById('root')

      this._props = {}

      this.render()
    }

    onCustomWidgetResize(width, height) {
      this.render()
    }

    set myDataSource(dataBinding) {
      this._myDataSource = dataBinding;
      this.render();
    }
    async render() {

      //==========================================
      await getScriptPromisify('https://cdn.bootcdn.net/ajax/libs/echarts/5.0.0/echarts.min.js');

      if (!this._myDataSource || this._myDataSource.state !== "success") {
        return;
      }

      const dimension_date = this._myDataSource.metadata.feeds.dimensions.values[0];
      const measure = this._myDataSource.metadata.feeds.measures.values[0];
      const data = this._myDataSource.data.map((data) => {
        const str = data[dimension_date].id;
        const yearMatch = str.match(/\d{4}/);
        const myyear = yearMatch ? parseInt(yearMatch[0]) : null;
        return {
          month: data[dimension_date].label,
          year: myyear,
          value: data[measure].raw,
        };
      });

      console.log(data);
      // var time = data.map(d => `${d.month} (${d.year})`);
      // var values = data.map(d => d.value);

      var filteredData = data.filter(d => d.year !== 2024);
      var time = filteredData.map(d => `${d.month} (${d.year})`);
      var values = filteredData.map(d => d.value);

      const chart = echarts.init(this._root)

      const option = {
        color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          data: time
        }],
        yAxis: [{
          type: 'value'
        }],
        series: [{
          name: 'Line 1',
          type: 'line',
          stack: 'Total',
          smooth: true,
          lineStyle: {
            width: 0
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(128, 255, 165)'
              },
              {
                offset: 1,
                color: 'rgb(1, 191, 236)'
              }
            ])
          },
          emphasis: {
            focus: 'series'
          },
          data: values
        }]
      };
      chart.setOption(option);


      const currentDate = new Date();
      const currentMonth = currentDate.getMonth(); // Returns a zero-based index, so January is 0
      
      // Calculate the previous two months
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1; // If current month is January, last month is December of previous year
      const lastLastMonth = lastMonth === 0 ? 11 : lastMonth - 1;
      
      // Filter data array to get current month and previous two months
      const currentMonthData = data.filter(d => d.year === currentDate.getFullYear() && d.month === getMonthName(currentMonth))[0];
      const lastMonthData = data.filter(d => d.year === currentDate.getFullYear() && d.month === getMonthName(lastMonth))[0];
      const lastLastMonthData = data.filter(d => d.year === currentDate.getFullYear() && d.month === getMonthName(lastLastMonth))[0];
      
      // Helper function to get month name from index
      function getMonthName(index) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[index];
      }

      const percent1 = this.shadowRoot.getElementById("percentage1");
      const percent2 = this.shadowRoot.getElementById("percentage2");

      const value1 = this.shadowRoot.getElementById("value1");
      const value2 = this.shadowRoot.getElementById("value2");


      value1.innerText = currentMonthData.value;
      value2.innerText = lastMonthData.value;

      percent1.innerText = this.dif(currentMonthData.value, lastMonthData.value);
      percent2.innerText = this.dif(lastMonthData.value, lastLastMonthData.value);

      if(this.dif(currentMonthData.value, lastMonthData.value, true)>=0){
        percent1.style.color = "green";
      } else {
        percent1.style.color = "red";
      }

      if(this.dif(lastMonthData.value, lastLastMonthData.value, true)>=0){
        percent2.style.color = "green";
      } else {
        percent2.style.color = "red";
      }


    }

    dif(v1,v2, check=false){
      var per = ((v1-v2)/((v1+v2)/2) * 100).toFixed(2);
      if(check==true){
        return per;
      } else {
        if(per>=0){
          return `+${per}%`;
        } else {
          return `${per}%`;
        }
      }
     
    }

  }
  customElements.define('com-sap-sample-echarts-prepared3', SamplePrepared)
})()