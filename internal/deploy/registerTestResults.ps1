write-host "Present working directory: $($pwd)"

[xml]$testsuites = get-content .\junit.xml
$anyFailures = $FALSE

foreach ($testsuite in $testsuites.DocumentElement.testsuite) {
    write-host " $($testsuite.name)"

    foreach ($testcase in $testsuite.testcase){
        $failed = $testcase.failure
        $time = [decimal]$testcase.time * 1000 # from seconds to milliseconds
        $testName = "$($testcase.classname) $($testcase.name)"

        if ($failed) {
            write-host "Failed $($testcase.name) $($testcase.failure.message) in $($time) ms"
            Add-AppveyorTest $testName -Outcome Failed -FileName $testsuite.name -ErrorMessage $testcase.failure.message -Duration $time
            $anyFailures = $TRUE
        } else {
            write-host "Passed $($testcase.name) in $($time) ms"
            Add-AppveyorTest $testName -Outcome Passed -FileName $testsuite.name -Duration $time
        }
    }
}

if ($anyFailures -eq $TRUE){
    write-host "Failing build as there are broken tests"
    $host.SetShouldExit(1)
}
