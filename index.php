<?php

try {
    $user = 'skyler@chrisscottwellness.com';
    $password = 'qVfn#5d6M$fNXB2';
    $customerKey = 'j43qd27kp89a';

    $wsdl = 'https://webservice.kareo.com/services/soap/2.1/KareoServices.svc?singleWsdl';
    $client = new SoapClient($wsdl);

    $request = array(
        'RequestHeader' => array('User' => $user, 'Password' => $password, 'CustomerKey' => $customerKey),
        'Filter'        => array(
            // 'FromLastModifiedDate' => '3/4/2021',
            'FromCreatedDate' => '11/1/2021'
            // 'CreatedDate' => '10/5/2021 8:20:22 AM'
        )
    );

    $params = array('request' => $request);
    $response = $client->GetPatients($params)->GetPatientsResult;

    echo json_encode($response);
    die;

} catch (Exception $err) {
    print "Error: " . $err->getMessage();
}