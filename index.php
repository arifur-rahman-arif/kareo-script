<?php

try {
    $user = 'User';
    $password = 'password?';
    $customerKey = 'customer key';

    $wsdl = 'https://webservice.kareo.com/services/soap/2.1/KareoServices.svc?singleWsdl';
    $client = new SoapClient($wsdl);

    $request = array(
        'RequestHeader' => array('User' => $user, 'Password' => $password, 'CustomerKey' => $customerKey),
        'Filter'        => array(
            // 'FromLastModifiedDate' => '3/4/2021',
            'FromCreatedDate' => '10/5/2021'
            // 'CreatedDate' => '10/5/2021 8:20:22 AM'
        )
    );

    $params = array('request' => $request);
    $response = $client->GetPatients($params)->GetPatientsResult;

    echo '<pre>';
    print_r($response);
    echo '</pre>';

} catch (Exception $err) {
    print "Error: " . $err->getMessage();
}