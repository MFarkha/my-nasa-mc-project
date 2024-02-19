## This directory contains instructions to deploy the app into Azure Web App Service

1. Manual steps to deploy with Azure CLI
- details from [here](https://github.com/marketplace/actions/azure-webapp-node20-fix)
- set the variables:
    - `export resourceGroup=NAME_OF_RESOURCE_GROUP`
    - `export location=AZURE_AVAILABILITY_ZONE`
    - `export appServicePlan=NAME_OF_SERVICE_PLAN`
    - `export webapp=WEB_APP_NAME`
    - `export mongo_atlas_uri=URI_OF_MONGO_ATLAS` - **uri of MongoDB Atlas URI**
- run the commands:
    - `az login`
    - `az group create --name $resourceGroup --location "$location"`
    - `az appservice plan create --name $appServicePlan --resource-group $resourceGroup --sku FREE  --is-linux`
    - `az webapp create --name $webapp --resource-group $resourceGroup --plan $appServicePlan --runtime "NODE|18-lts"`
    - `az webapp log config --name $webapp --resource-group $resourceGroup --docker-container-logging filesystem`
    - `az webapp config appsettings set -g resourceGroup -n $webapp --settings MONGO_ATLAS_URI=$mongo_atlas_uri`

- to watch logs of the app container:
    - `az webapp log tail --name $webapp --resource-group $resourceGroup`

- to delete resource group:
    - `az group delete --resource-group $resourceGroup`