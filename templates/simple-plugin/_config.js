// Import Packages
import * as p from "@clack/prompts";

//#region  Questions
// Question for Template Generation
export const questions = await p.group(
  {
    path: () =>
      p.text({
        message: "Where should we generate the template file?",
        placeholder: "./sparkling-solid",
        validate: (value) => {
          if (!value) return "Please enter a path.";
          if (value[0] !== ".") return "Please enter a relative path.";
        },
      }),
    namespace: () =>
      p.text({
        message: "What is the Namespace of the Plugin?",
        placeholder: "DTT.Plugins.Entity",
        validate: (value) => {
          if (!value) return "Please provide a Namespace.";
        },
      }),
    classname: () =>
      p.text({
        message: "What is the Class Name of the Plugin?",
        placeholder: "EntityNamePlugin",
        validate: (value) => {
          if (!value) return "Please provide a Class Name.";
        },
      }),
    entity: () =>
      p.text({
        message: "What entity do you want to generate a plugin for?",
        placeholder: "msc_application",
        validate: (value) => {
          if (!value)
            return "Please enter the logical name of an entity";
        },
      }),
    configuration: () =>
      p.groupMultiselect({
        message: "Which configuration do you wish to include?",
        options: {
          create: [
            { value: "create-pre-validation", label: "pre-validation" },
            { value: "create-pre-operation", label: "pre-operation" },
            { value: "create-post-operation", label: "post-operation" },
          ],
          update: [
            { value: "update-pre-validation", label: "pre-validation" },
            { value: "update-pre-operation", label: "pre-operation" },
            { value: "update-post-operation", label: "post-operation" },
          ],
          delete: [
            { value: "delete-pre-validation", label: "pre-validation" },
            { value: "delete-pre-operation", label: "pre-operation" },
            { value: "delete-post-operation", label: "post-operation" },
          ],
        },
      }),
    generate: () =>
      p.confirm({
        message: "Confrim template generation",
        initialValue: false,
      }),
  },
  {
    onCancel: () => {
      p.cancel("Operation cancelled.");
      process.exit(0);
    },
  }
);
//#endregion

//#region Template Hydration
export function processors(questions) {
  let myClassName = questions.classname;
  let myNameSpace = questions.namespace;
  let myEntityName = questions.entity;

  let configuration = questions.configuration;

  let createMessageFlag =
    configuration.filter((config) => {
      return config.includes("create");
    }).length > 0;
  let updateMessageFlag =
    configuration.filter((config) => {
      return config.includes("update");
    }).length > 0;
  let deleteMessageFlag =
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

  let createMessageTemplate = `${
    createMessageFlag
      ? `case Helper.CreateMessage:
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
  }`;

  let updateMessageTemplate = `${
    updateMessageFlag
      ? `case Helper.UpdateMessage:
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
  }`;
  let deleteMessageTemplate = `${
    deleteMessageFlag
      ? `case Helper.DeleteMessage:
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
  }`;

  let preValidationActivityTempalte = preValidationStage ? `public void PerformPreValidationActivities(Entity entity, IPluginExecutionContext context, IOrganizationService service, ITracingService tracingService)
        {
            // Write Pre-Validation Functions Here
        }` : ``;
  let preOperationActivityTempalte = PreOperationStage ? `public void PerformPreOperationActivities(Entity entity, IPluginExecutionContext context, IOrganizationService service, ITracingService tracingService)
        {
            // Write Pre-Operation Functions Here
        }` : ``;
  let postOperationActivityTempalte = PostOperationStage ? `public void PerformPostOperationActivities(Entity entity, IPluginExecutionContext context, IOrganizationService service, ITracingService tracingService)
        {
            // Write Post-Operation Functions Here
        }`: ``;

  function nameSpace(input) {
    return input.replace(/NAMESPACE/g, `${myNameSpace}`);
  }

  function className(input) {
    return input.replace(/CLASSNAME/g, `${myClassName}`);
  }

  function entityName(input) {
    return input.replace(/ENTITY_LOGICALNAME/g, `${myEntityName}`);
  }

  function createMessage(input) {
    return input.replace(/CREATE_MESSAGE/g, createMessageTemplate);
  }

  function updateMessage(input) {
    return input.replace(/UPDATE_MESSAGE/g, updateMessageTemplate);
  }

  function deleteMessage(input) {
    return input.replace(/DELETE_MESSAGE/g, deleteMessageTemplate);
  }

  function preValidationActivity(input) {
    return input.replace(
      /PREVALIDATION_ACTIVITY/g,
      preValidationActivityTempalte
    );
  }

  function preOperationActivity(input) {
    return input.replace(
      /PREOPERATION_ACTIVITY/g,
      preOperationActivityTempalte
    );
  }

  function postOperationActivity(input) {
    return input.replace(
      /POSTOPERATION_ACTIVITY/g,
      postOperationActivityTempalte
    );
  }

  let processorArray = [
    {
      files: "simplePlugin.cs",
      processor: [
        nameSpace,
        className,
        entityName,
        createMessage,
        updateMessage,
        deleteMessage,
        preValidationActivity,
        preOperationActivity,
        postOperationActivity,
      ],
    },
    {
      files: "helper.cs",
      processor: [nameSpace],
    },
    {
      files: 'simplePluginFull.cs',
      processor: [nameSpace, className,entityName]
    }
  ];

  return processorArray;
}
//#endregion
