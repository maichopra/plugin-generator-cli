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
                    CREATE_MESSAGE

                    UPDATE_MESSAGE

                    DELETE_MESSAGE
                }
            }
            catch (Exception ex)
            {
                tracingService.Trace("ENTITY_LOGICALNAME: {0}", ex.ToString());
                throw;
            }
        }
        PREVALIDATION_ACTIVITY
        PREOPERATION_ACTIVITY
        POSTOPERATION_ACTIVITY
    }
}
