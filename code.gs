function testFunction() {
    let kareo = "https://webservice.kareo.com/services/soap/2.1/KareoServices.svc?singleWsdl";

    let xml = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sch="http://www.kareo.com/api/schemas/">
      <soapenv:Header/>
      <soapenv:Body>
          <sch:GetPatients>
            <!--Optional:-->
            <sch:request>
                <sch:RequestHeader>
                    <sch:CustomerKey>CustomerKey</sch:CustomerKey>
                  <sch:Password>Password</sch:Password>
                  <sch:User>user</sch:User>
                </sch:RequestHeader>
                <sch:Fields>
                  <!--Optional:-->
                  <sch:AddressLine1>true</sch:AddressLine1>
                </sch:Fields>
                <!--Optional:-->
                <sch:Filter>
                  <sch:FromCreatedDate>10/5/2021</sch:FromCreatedDate>
                </sch:Filter>
            </sch:request>
          </sch:GetPatients>
      </soapenv:Body>
    </soapenv:Envelope>
    `;

    let options = {
        method: "POST",
        muteHttpExceptions: true,
        headers: {
            "Content-Type": "text/xml; charset=utf-8",
            SOAPAction: "http://www.kareo.com/api/schemas/KareoServices/GetPatients",
        },
        payload: xml,
    };

    let response = UrlFetchApp.fetch(kareo, options);
    Logger.log(response);
}
