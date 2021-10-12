var kareoDate = "10/5/2021";
var userName = "username here";
var password = "password here";
var customerKey = "key here";

function onOpen(e) {
    SpreadsheetApp.getUi()
        .createMenu("Kareo Script")
        .addItem("Get Patients", "getPatients")
        .addToUi();
}

function getPatients() {
    let patientsResponse = getApiResponse();
    let JsonResponse = xmlToJson(patientsResponse);
    let patientsData =
        JsonResponse.Envelope.Body.GetPatientsResponse.GetPatientsResult.Patients.PatientData;

    if (!Array.isArray(patientsData))
        return Logger.log(`Patients data is not in array format. Response is: ${patientsData}`);

    for (let i = 0; i < patientsData.length; i++) {
        const singlePatientData = patientsData[i];
        insertData(singlePatientData);
    }
}

function getApiResponse() {
    let url = "https://webservice.kareo.com/services/soap/2.1/KareoServices.svc?singleWsdl";

    let xml = requestXML();

    let options = {
        method: "POST",
        muteHttpExceptions: true,
        headers: {
            "Content-Type": "text/xml; charset=utf-8",
            SOAPAction: "http://www.kareo.com/api/schemas/KareoServices/GetPatients",
        },
        payload: xml,
    };

    try {
        let response = UrlFetchApp.fetch(url, options);
        return response;
    } catch (error) {
        return Logger.log(error);
    }
}

function insertData(response) {
    // Get slelected sheet
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Patients");

    if (typeof response != "object") return;

    // Convert the values as an array
    let insertValues = getInsertValues(response);

    // Append the data in sheet
    sheet.appendRow(insertValues);
}

function getInsertValues(patient) {
    return [
        patient.ID.Text || "",
        patient.FirstName.Text || "",
        patient.LastName.Text || "",
        patient.Age.Text || "",
        patient.DOB.Text || "",
        patient.EmailAddress.Text || "",
        patient.MobilePhone.Text || "",
        patient.AddressLine1.Text || "",
        patient.AddressLine2.Text || "",
        patient.City.Text || "",
        patient.State.Text || "",
        patient.ZipCode.Text || "",
        patient.CollectionCategoryName.Text || "",
    ];
}

function requestXML() {
    let xml = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sch="http://www.kareo.com/api/schemas/">
      <soapenv:Header/>
      <soapenv:Body>
          <sch:GetPatients>
            <sch:request>
                <sch:RequestHeader>
                  <sch:CustomerKey>${customerKey}</sch:CustomerKey>
                  <sch:Password>${password}</sch:Password>
                  <sch:User>${userName}</sch:User>
                </sch:RequestHeader>
                <!--Optional:-->
                <sch:Fields>
                </sch:Fields>
                <!--Optional:-->
                <sch:Filter>
                  <sch:FromCreatedDate>${kareoDate}</sch:FromCreatedDate>
                </sch:Filter>
            </sch:request>
          </sch:GetPatients>
      </soapenv:Body>
    </soapenv:Envelope>
    `;
    return xml;
}

function xmlToJson(xml) {
    let doc = XmlService.parse(xml);
    let result = {};
    var root = doc.getRootElement();
    result[root.getName()] = elementToJSON(root);
    return result;
}

function elementToJSON(element) {
    let result = {};
    // Attributes.
    element.getAttributes().forEach(function (attribute) {
        result[attribute.getName()] = attribute.getValue();
    });
    // Child elements.
    element.getChildren().forEach(function (child) {
        let key = child.getName();
        let value = elementToJSON(child);
        if (result[key]) {
            if (!(result[key] instanceof Array)) {
                result[key] = [result[key]];
            }
            result[key].push(value);
        } else {
            result[key] = value;
        }
    });
    // Text content.
    if (element.getText()) {
        result["Text"] = element.getText();
    }
    return result;
}
