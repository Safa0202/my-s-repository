(function () {
    let tmpl = document.createElement("template");
    tmpl.innerHTML = `
      <style>
          fieldset {
              margin-bottom: 10px;
              border: 1px solid #afafaf;
              border-radius: 3px;
          }
          table {
              width: 100%;
          }
          input, textarea, select {
              font-family: "72",Arial,Helvetica,sans-serif;
              width: 100%;
              padding: 4px;
              box-sizing: border-box;
              border: 1px solid #bfbfbf;
          }
          input[type=checkbox] {
              width: inherit;
              margin: 6px 3px 6px 0;
              vertical-align: middle;
          }
      </style>
      <form id="form" autocomplete="off" class="sapFpaAppBuildingUiTextArea  sap-custom-text-area-placeholder">
        <fieldset> 
          <legend>General</legend>
          <table>
            <tr>
              <td><label for="REST API URL">REST API URL</label></td>
              <td><input id="restapiurl" name="restapiurl" type="text" class="sapMInputBaseInner"></td>
            </tr>
            <tr>
              <td><label for="Widget Name">Widget Name</label></td>
              <td><input id="name" name="name" type="text" class="sapMInputBaseInner"></td>
            </tr>
            <tr>
              <td><label for="Client ID">Client ID</label></td>
              <td><input id="clientID" name="clientID" type="text" class="sapMInputBaseInner"></td>
            </tr>
            <tr>
              <td><label for="API Secret">API Secret</label></td>
              <td><input id="apiSecret" name="apiSecret" type="text" class="sapMInputBaseInner"></td>
            </tr>
          </table>
        </fieldset>
        <button type="submit" hidden>Submit</button>
      </form>
    `;

    class styleApp extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({ mode: "open" });
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));

            let form = this._shadowRoot.getElementById("form");
            form.addEventListener("submit", this._submit.bind(this));
            form.addEventListener("change", this._change.bind(this));
        }

        connectedCallback() {
        }

        _submit(e) {
            e.preventDefault();
            let properties = {};
            for (let name of restAPIAps.observedAttributes) {
                properties[name] = this[name];
            }
            console.log(properties);
            this._firePropertiesChanged(properties);
            return false;
        }
        _change(e) {
            this._changeProperty(e.target.name);
        }
        _changeProperty(name) {
            let properties = {};
            properties[name] = this[name];
            this._firePropertiesChanged(properties);
        }

        _firePropertiesChanged(properties) {
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: properties
                }
            }));
        }

        get restapiurl() {
            return this.getValue("restapiurl");
        }
        set restapiurl(value) {
            console.log("value: " + value);
            this.setValue("restapiurl", value);
        }

        get name() {
            return this.getValue("name");
        }
        set name(value) {
            this.setValue("name", value);
        }

        get clientID() {
            return this.getValue("clientID");
        }
        set clientID(value) {
            this.setValue("clientID", value);
        }

        get apiSecret() {
            return this.getValue("apiSecret");
        }
        set apiSecret(value) {
            this.setValue("apiSecret", value);
        }

        getValue(id) {
            return this._shadowRoot.getElementById(id).value;
        }
        setValue(id, value) {
            console.log(id + ":" + value);
            this._shadowRoot.getElementById(id).value = value;
        }

        static get observedAttributes() {
            return [
                "restapiurl",
                "name",
                "clientID",
                "apiSecret"
            ];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue != newValue) {
                this[name] = newValue;
            }
        }
    }
    customElements.define("com-ifm-hack-style-app", styleApp);
})();