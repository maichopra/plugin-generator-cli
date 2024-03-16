using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Metadata;
using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk.Query;

namespace NAMESPACE
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