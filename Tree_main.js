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
            await getScriptPromisify('https://cdn.bootcdn.net/ajax/libs/echarts/5.0.0/echarts.min.js');

            if (!this._myDataSource || this._myDataSource.state !== "success") {
                return;
            }

            const dimension_cat = this._myDataSource.metadata.feeds.dimensions.values[0];
            const dimension_name = this._myDataSource.metadata.feeds.dimensions.values[1];
            const measure = this._myDataSource.metadata.feeds.measures.values[0];
            const data = this._myDataSource.data.map((data) => {
                return {
                    name: data[dimension_name].label,
                    category: data[dimension_cat].label,
                    value: data[measure].raw,
                };
            });
            
            const result = data.reduce((accumulator, currentValue) => {
                const categoryIndex = accumulator.children.findIndex(item => item.name === currentValue.category);
                const value = parseInt(currentValue.value);
                if (categoryIndex === -1) {
                    accumulator.children.push({
                        name: currentValue.category,
                        value: value,
                        children: [{
                            name: currentValue.name,
                            value: value
                        }]
                    });
                } else {
                    const pizzaIndex = accumulator.children[categoryIndex].children.findIndex(item => item.name === currentValue.name);
                    if (pizzaIndex === -1) {
                        accumulator.children[categoryIndex].children.push({
                            name: currentValue.name,
                            value: value
                        });
                    } else {
                        accumulator.children[categoryIndex].children[pizzaIndex].value += value;
                    }
                    accumulator.children[categoryIndex].value += value;
                }
                accumulator.value += value;
                return accumulator;
            }, {
                name: 'All Pizza',
                value: 0,
                children: []
            });

            const chart = echarts.init(this._root)


            const option = {
                tooltip: {
                    trigger: 'item',
                    triggerOn: 'mousemove'
                },
                series: [{
                    type: 'tree',
                    data: [result],
                    top: '1%',
                    left: '7%',
                    bottom: '1%',
                    right: '20%',
                    symbolSize: 7,
                    label: {
                        position: 'left',
                        verticalAlign: 'middle',
                        align: 'right',
                        fontSize: 9
                    },
                    leaves: {
                        label: {
                            position: 'right',
                            verticalAlign: 'middle',
                            align: 'left'
                        }
                    },
                    emphasis: {
                        focus: 'descendant'
                    },
                    expandAndCollapse: true,
                    animationDuration: 550,
                    animationDurationUpdate: 750
                }]
            }
            chart.setOption(option)

        }
    }
    customElements.define('com-sap-sample-echarts-prepared3', SamplePrepared)
})()
