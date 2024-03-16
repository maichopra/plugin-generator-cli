function mapping() {
  let map = [
    {
      file: "helper.cs",
      hydrationArray: [
        {
          from: /NAMESPACE/g,
          key: "NAMESPACE",
          to: ``,
        },
      ],
    },
    {
      file: "simplePlugin.cs",
      hydrationArray: [
        {
          from: /NAMESPACE/g,
          key: "NAMESPACE",
          to: ``,
        },
        {
          from: /CLASSNAME/g,
          key: "CLASSNAME",
          to: ``,
        },
        {
          from: /ENTITY_LOGICALNAME/g,
          key: "ENTITY_LOGICALNAME",
          to: ``,
        },
      ],
    },
  ];

  return map;
}
export default mapping;
