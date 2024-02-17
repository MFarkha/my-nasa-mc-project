## This directory contains scripts to deploy the app into Azure Web App Service

1. Manual steps to deploy with Azure CLI
- set the variables:
    - `export resourceGroup=NAME_OF_RESOURCE_GROUP`
    - `export location=AZURE_AVAILABILITY_ZONE`
    - `export appServicePlan=NAME_OF_SERVICE_PLAN`
    - `export webapp=WEB_APP_NAME`
- run the commands:
    - `az login`
    - `az group create --name $resourceGroup --location "$location"`
    - `az appservice plan create --name $appServicePlan --resource-group $resourceGroup --sku FREE  --is-linux`
    - `az webapp create --name $webapp --resource-group $resourceGroup --plan $appServicePlan --runtime "NODE|18-lts"`