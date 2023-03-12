var getScriptPromisify = (src) => {
  return new Promise(resolve => {
    $.getScript(src, resolve)
  })
}

(function () {
  const prepared = document.createElement('template')
  prepared.innerHTML = `
      <style>
      </style>
      <div id="root" style="width: 100%; height: 100%;">
      </div>
    `
  class SamplePrepared extends HTMLElement {
    constructor () {
      super()

      this._shadowRoot = this.attachShadow({ mode: 'open' })
      this._shadowRoot.appendChild(prepared.content.cloneNode(true))

      this._root = this._shadowRoot.getElementById('root')

      this._props = {}

      this.render()
    }

    onCustomWidgetResize (width, height) {
      this.render()
    }

    async render () {
      await getScriptPromisify('https://cdn.bootcdn.net/ajax/libs/echarts/5.0.0/echarts.min.js')

      const chart = echarts.init(this._root)
      const option = {
        
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // Use axis to trigger tooltip
              type: 'shadow'        // 'shadow' as default; can also be 'line' or 'shadow'
            }
          },
        
          legend: {
            data: ['Sales', 'Quntity']  //At the top it will show legend
          },
        
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
            
          xAxis: {
				    type: 'value',
			    },
			
          yAxis: {
				    type: 'category',
            data: region
			    },
			
          series: [
            {
              name: 'Sales',
              data: sales,
              type: 'bar',
              stack : 'total',
              
              showBackground: true,label: {
                show: true
              },

              emphasis: {
                focus: 'series'
              },
            
              backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)'
              }
		    	  },
            
            {
              name: 'Quntity',
              data: quntity,
              type: 'bar',
              stack : 'total',
              
              showBackground: true,label: {
                show: true
              },
            
              emphasis: {
                focus: 'series'
              },
              
              backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)'
              }
			      }
          ],
            
          animationDuration: 2000
      }
      chart.setOption(option)
    }
  }

  customElements.define('com-sap-sample-echarts-prepared', SamplePrepared)
})()
