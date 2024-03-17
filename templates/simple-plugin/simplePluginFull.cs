using Microsoft.Xrm.Sdk;
using System;

namespace NAMESPACE
{
    public class CLASSNAME : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            //This is the execute method
            ITracingService tracingService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            if (!context.InputParameters.Contains("Target") || context.PrimaryEntityName != "ENTITY_LOGICALNAME")
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
                    case Helper.CreateMessage:
                        switch (context.Stage.ToString())
                        {
                            case Helper.PreValidation:
                                PerformPreValidationActivities(entity, context, service, tracingService);
                                break;
                            case Helper.PreOperation:
                                PerformPreOperationActivities(entity, context, service, tracingService);
                                break;
                            case Helper.PostOperation:
                                PerformPostOperationActivities(entity, context, service, tracingService);
                                break;
                        }
                        break;

                    case Helper.UpdateMessage:
                        switch (context.Stage.ToString())
                        {
                            case Helper.PreValidation:
                                PerformPreValidationActivities(entity, context, service, tracingService);
                                break;
                            case Helper.PreOperation:
                                PerformPreOperationActivities(entity, context, service, tracingService);
                                break;
                            case Helper.PostOperation:
                                PerformPostOperationActivities(entity, context, service, tracingService);
                                break;
                        }
                        break;

                    case Helper.DeleteMessage:
                        switch (context.Stage.ToString())
                        {
                            case Helper.PreValidation:
                                PerformPreValidationActivities(entity, context, service, tracingService);
                                break;
                            case Helper.PreOperation:
                                PerformPreOperationActivities(entity, context, service, tracingService);
                                break;
                            case Helper.PostOperation:
                                PerformPostOperationActivities(entity, context, service, tracingService);
                                break;
                        }
                        break;
                }
            }
            catch (Exception ex)
            {
                tracingService.Trace("ENTITY_LOGICALNAME: {0}", ex.ToString());
                throw;
            }
        }
        public void PerformPreValidationActivities(Entity entity, IPluginExecutionContext context, IOrganizationService service, ITracingService tracingService)
        {
            // Write Pre-Validation Functions Here
        }
        public void PerformPreOperationActivities(Entity entity, IPluginExecutionContext context, IOrganizationService service, ITracingService tracingService)
        {
            // Write Pre-Operation Functions Here
        }
        public void PerformPostOperationActivities(Entity entity, IPluginExecutionContext context, IOrganizationService service, ITracingService tracingService)
        {
            // Write Post-Operation Functions Here
        }
    }
}
