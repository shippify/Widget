export default `
  <div>
    <div style="height: 100px;" id="shpy-map-container"></div>
    Vehicle
    <select id="shpy-vehicle-type-select">
      <option value="">Select vehicle</option>
      <option value="bicycle">Bicycle</option>
      <option value="motorcycle">Motorcycle</option>
      <option value="car">Car</option>
      <option value="suv">SUV</option>
      <option value="truck">Truck</option>
    </select>
    <div>Location address: <input id="shpy-delivery-address-input" placeholder="Insert address"/></div>
    <div>Name: <input id="shpy-delivery-contact-name-input" placeholder="Insert contact name"/></div>
    <div>Email: <input id="shpy-delivery-contact-email-input" placeholder="Insert contact email"/></div>
    <div>Phone: <input id="shpy-delivery-contact-phone-input" placeholder="Insert contact phone"/></div>
    <div>Special Instructions: <input id="shpy-delivery-special_instructions-input" placeholder="Insert special instructions"/></div>
    <button id="shpy-order-button">Order</button>
  </div>
`
