**_Build Data Dictionary_**

To build `dataDictionary.json`, paste a tab delimited .txt file titled 'Data Dictionary NC Campaign Contributions UTF8.txt' into the root of the project repo and run `make build-dictionary`. To use a custom file, past your file into the project root and run `node run createDataDictionary $filename` where `$filename` is the name of your dictionary .txt file.

The .txt file should be tab delimited, UTF-8 encoded, and have the following columns

- longVariableName
- definition
- source
