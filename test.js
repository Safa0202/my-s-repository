var getScriptPromisify = (src) => {
    return new Promise(resolve => {
      $.getScript(src, resolve)
    })
  }
  
  (function () {

    //Chart Block in HTML
    const prepared = document.createElement('template')
    prepared.innerHTML = `
        <style>
        </style>
        <div id="root" style="width: 100%; height: 100%;">
        </div>
      `
    
    //Main JS Class holds methods to be called
    class SamplePrepared extends HTMLElement {
      constructor () {

        //call SAC DOM Super method to get shadow DOM information
        super()
        
        //Get shadow DOM informations
        this._shadowRoot = this.attachShadow({ mode: 'open' })
        this._shadowRoot.appendChild(prepared.content.cloneNode(true))
        
        //Set HTML block in shadow DOM of SAC
        this._root = this._shadowRoot.getElementById('root')
  
        //_props object is used to hold properties information
        this._props = {}
        
        //Call render() method to plot chart
        this.render(this.resultSet)
      }
  
      //onCustomWidgetResize() method is execute whenever CW will resized in SAC.
      onCustomWidgetResize (width, height) {
        
        //Call render() method to plot chart
        this.render(this.resultSet)
      }
      
      //render() method to plot chart - resultSet1 holds data from SAC table/chart.
      async render (resultSet1) {
        await getScriptPromisify('https://cdn.bootcdn.net/ajax/libs/echarts/5.0.0/echarts.min.js')


        const region = []
        const sales =[]
        const quntity = []
        var j = 0

        console.log(resultSet1)

        var len = resultSet1.length

        for(var i =0;i<len;i++)
        {
          if(i%2==0)
          {
          sales[j] = resultSet1[i]["@MeasureDimension"].rawValue
          region[j] = resultSet1[i].Region.description
          }
          else
          {
            quntity[j] = resultSet1[i]["@MeasureDimension"].rawValue
            j++
          }
        }
  
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
