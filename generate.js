import fs, { stat, write } from "fs";
import path from "path";
import { promisify } from "util";

async function generateFiles(
  path,
  namespace,
  classname,
  entity,
  configuration,
  helper
) {
  await writeFile(path, namespace, classname, entity, configuration);

  if (helper) {
    await writeHelper(namespace);
  }
}

async function writeHelper(namespace) {
  let content = `
  using Microsoft.Xrm.Sdk.Messages;
  using Microsoft.Xrm.Sdk.Metadata;
  using Microsoft.Xrm.Sdk;
  using System;
  using System.Collections.Generic;
  using System.Linq;
  using System.Text;
  using System.Threading.Tasks;
  using Microsoft.Xrm.Sdk.Query;

  namespace ${namespace}
  {
      public static class Helper
      {
          public const string
              PreOperation = "20",
              PostOperation = "40",
              PreValidation = "10";

          public const string
              CreateMessage = "create",
              UpdateMessage = "update",
              DeleteMessage = "delete";
      }
  }
  `;
  try {
    await promisify(fs.writeFile)(`helper.cs`, content);
  } catch (e) {
    Logger.debug(e);
    throw new Error(`Couldn't create file: '${pathArg}'`);
  }
}

async function writeFile(path, namespace, classname, entity, configuration) {
  let createMessage =
    configuration.filter((config) => {
      return config.includes("create");
    }).length > 0;
  let updateMessage =
    configuration.filter((config) => {
      return config.includes("update");
    }).length > 0;
  let deleteMessage =
    configuration.filter((config) => {
      return config.includes("delete");
    }).length > 0;

  let preValidationStage =
    configuration.filter((config) => {
      return config.includes("pre-validation");
    }).length > 0;
  let PreOperationStage =
    configuration.filter((config) => {
      return config.includes("pre-operation");
    }).length > 0;
  let PostOperationStage =
    configuration.filter((config) => {
      return config.includes("post-operation");
    }).length > 0;

  let content = `
  using Microsoft.Xrm.Sdk;
  using System;

  namespace ${namespace}
  {
      public class ${classname} : IPlugin
      {
          public void Execute(IServiceProvider serviceProvider)
          {
              //This is the execute method
              ITracingService tracingService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
              IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
              if (!context.InputParameters.Contains("Target") || context.PrimaryEntityName != "${entity}")
              { 
                  throw new InvalidPluginExecutionException("The plugin is not running in the context of the entity or has no target");
              }            
              IOrganizationServiceFactory organizationServiceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
              IOrganizationService service = organizationServiceFactory.CreateOrganizationService(context.UserId);

              try
              {
                  Entity entity = new Entity();
                  if (context.InputParameters["Target"] is Entity)
                  {
                      entity = (Entity)context.InputParameters["Target"];
                  }

                  switch (context.MessageName.ToLower())
                  {
                      ${
                        createMessage
                          ? `
                      case Helper.CreateMessage:
                        switch (context.Stage.ToString())
                        {
                          ${
                            configuration.includes("create-pre-validation")
                              ? `case Helper.PreValidation:
                                  PerformPreValidationActivities(entity, context, service, tracingService);
                                  break;`
                              : ``
                          }  

                          ${
                            configuration.includes("create-pre-operation")
                              ? `case Helper.PreOperation:
                                  PerformPreOperationActivities(entity, context, service, tracingService);
                                  break;`
                              : ``
                          } 

                          ${
                            configuration.includes("create-post-operation")
                              ? `case Helper.PostOperation:
                                  PerformPostOperationActivities(entity, context, service, tracingService);
                                  break;`
                              : ``
                          } 
                        }
                        break;`
                          : ``
                      }

                      ${
                        updateMessage
                          ? `
                      case Helper.UpdateMessage:
                        switch (context.Stage.ToString())
                        {
                          ${
                            configuration.includes("update-pre-validation")
                              ? `case Helper.PreValidation:
                                  PerformPreValidationActivities(entity, context, service, tracingService);
                                  break;`
                              : ``
                          }  

                          ${
                            configuration.includes("update-pre-operation")
                              ? `case Helper.PreOperation:
                                  PerformPreOperationActivities(entity, context, service, tracingService);
                                  break;`
                              : ``
                          } 

                          ${
                            configuration.includes("update-post-operation")
                              ? `case Helper.PostOperation:
                                  PerformPostOperationActivities(entity, context, service, tracingService);
                                  break;`
                              : ``
                          } 
                        }
                        break;`
                          : ``
                      }

                      ${
                        deleteMessage
                          ? `
                      case Helper.DeleteMessage:
                        switch (context.Stage.ToString())
                        {
                          ${
                            configuration.includes("delete-pre-validation")
                              ? `case Helper.PreValidation:
                                  PerformPreValidationActivities(entity, context, service, tracingService);
                                  break;`
                              : ``
                          }  

                          ${
                            configuration.includes("delete-pre-operation")
                              ? `case Helper.PreOperation:
                                  PerformPreOperationActivities(entity, context, service, tracingService);
                                  break;`
                              : ``
                          } 

                          ${
                            configuration.includes("delete-post-operation")
                              ? `case Helper.PostOperation:
                                  PerformPostOperationActivities(entity, context, service, tracingService);
                                  break;`
                              : ``
                          } 
                        }
                        break;`
                          : ``
                      }
                  }
              }
              catch (Exception ex)
              {
                  tracingService.Trace("${classname}: {0}", ex.ToString());
                  throw;
              }
          }

          ${
            preValidationStage
              ? `public void PerformPreValidationActivities(Entity entity, IPluginExecutionContext context, IOrganizationService service, ITracingService tracingService)
          {
              // Write Pre-Validation Functions Here
          }`
              : ``
          }
          
          ${
            PreOperationStage
              ? `public void PerformPreOperationActivities(Entity entity, IPluginExecutionContext context, IOrganizationService service, ITracingService tracingService)
              {
                // Write Pre-Operation Functions Here
              }`
              : ``
          }

          ${
            PostOperationStage
              ? `public void PerformPostOperationActivities(Entity entity, IPluginExecutionContext context, IOrganizationService service, ITracingService tracingService)
              {
                // Write Post-Operation Functions Here
              } `
              : ``
          }
      }
  }  
`;

  try {
    await promisify(fs.writeFile)(`${path}.cs`, content);
  } catch (e) {
    Logger.debug(e);
    throw new Error(`Couldn't create file: '${pathArg}'`);
  }
}

export { generateFiles };
