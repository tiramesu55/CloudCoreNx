export const GetSuitesByPermission = {
  suites: [
    {
      name: 'Shipping Insights',
      reports: [
        {
          reportId: '3c7d3cd2-a042-4632-b88e-73517df4678d',
          reportName: 'SLA Dashboard',
          beta: null,
        },
        {
          reportId: 'ca3a8966-f4fc-44c9-bad9-5d38f7e3dd9c',
          reportName: 'SLA Report',
          beta: null,
        },
        {
          reportId: '82680a46-b33c-46ad-abe4-77fce93884da',
          reportName: 'Service Level Dashboard',
          beta: false,
        },
        {
          reportId: '322d758a-3859-4337-90ea-2315860d32db',
          reportName: 'Shipping Insights',
          beta: false,
        },
      ],
    },
    {
      name: 'Rx Workflow',
      reports: [
        {
          reportId: '700d571c-337c-49fa-bd61-6075637c9903',
          reportName: 'Shipped Report',
          beta: null,
        },
        {
          reportId: '0ef58877-dad7-4603-882e-e11609bd0904',
          reportName: 'Cancellations Report',
          beta: null,
        },
        {
          reportId: '5506c7e3-eec9-48e6-8184-94e331ab2d07',
          reportName: 'Cancellations Dashboard',
          beta: false,
        },
        {
          reportId: '33404635-9fe9-4dca-84ac-08ae3696da8a',
          reportName: 'Filling Timeliness Report',
          beta: null,
        },
      ],
    },
  ],
};
export const MaintenanceDetails = [
  {
    id: 'fc7ee72b-c117-4a07-a0a5-d9301e18f723',
    orgCode: 'xxxx',
    inactiveDate: null,
    startDate: null,
    endDate: '2022-04-29T16:58:39',
    createdBy: null,
    modifiedBy: 'nomfa@iarxservicestest.onmicrosoft.com',
    createdDate: null,
    modifiedDate: '2023-02-08T13:14:51.1722306Z',
    name: 'ERV',
    roles: [
      { role: 'pharmacist', roleName: 'Pharmacist', permissions: ['approve'] },
      { role: 'technician', roleName: 'Technitian', permissions: ['review'] },
    ],
    appCode: 'erv',
    maintenanceStartDate: '2023-02-08T08:17:00',
    maintenanceEndDate: '2023-02-08T08:22:00',
    maintenanceDisplayStartDate: '2023-02-08T08:16:00',
    maintenanceDisplayEndDate: '2023-02-08T08:22:00',
    maintenanceReason: 'testing',
    bypassedUser: false,
    fullLockout: true,
  },
  {
    id: '1c7ee72b-c117-4a07-a0a5-d9301e18f72f',
    orgCode: null,
    inactiveDate: null,
    startDate: null,
    endDate: '2022-04-29T16:58:39',
    createdBy: 'xyz',
    modifiedBy: 'nomfa@iarxservicestest.onmicrosoft.com',
    createdDate: null,
    modifiedDate: '2023-02-08T13:14:51.1722309Z',
    name: 'Analytics',
    roles: [
      {
        role: 'exec',
        roleName: 'Executive',
        permissions: ['operations', 'productivity', 'Hardware'],
      },
      {
        role: 'developer',
        roleName: 'Developer',
        permissions: ['test', 'operations', 'productivity'],
      },
      {
        role: 'analyst',
        roleName: 'Analyst',
        permissions: ['test', 'operations'],
      },
      { role: 'test', roleName: 'Super Tester', permissions: ['test'] },
    ],
    appCode: 'analytics',
    maintenanceStartDate: '2023-02-08T08:17:00',
    maintenanceEndDate: '2023-02-08T08:22:00',
    maintenanceDisplayStartDate: '2023-02-08T08:16:00',
    maintenanceDisplayEndDate: '2023-02-08T08:22:00',
    maintenanceReason: 'testing',
    bypassedUser: false,
    fullLockout: true,
  },
  {
    id: 'a0384374-2e6b-4210-bdb2-9a362d87dc0d',
    orgCode: 'xyz',
    inactiveDate: null,
    startDate: null,
    endDate: '2022-04-29T16:58:39',
    createdBy: null,
    modifiedBy: 'nomfa@iarxservicestest.onmicrosoft.com',
    createdDate: null,
    modifiedDate: '2023-02-08T15:31:14.256619Z',
    name: 'Platform Management',
    roles: [
      { role: 'admin', roleName: 'Global Admin', permissions: ['global'] },
      {
        role: 'organization',
        roleName: 'Organization Admin',
        permissions: ['organization'],
      },
    ],
    appCode: 'admin',
    maintenanceStartDate: '2023-02-08T10:28:00',
    maintenanceEndDate: '2023-02-08T10:33:00',
    maintenanceDisplayStartDate: '2023-02-08T10:28:00',
    maintenanceDisplayEndDate: '2023-02-08T10:33:00',
    maintenanceReason: 'test',
    bypassedUser: false,
    fullLockout: true,
  },
  {
    id: '560c015e-5d7d-4e51-aed5-2f824805f523',
    orgCode: 'iarx',
    inactiveDate: '2022-06-21T18:36:14.800061Z',
    startDate: null,
    endDate: '2022-04-29T16:58:39',
    createdBy: null,
    modifiedBy: 'nomfa@iarxservicestest.onmicrosoft.com',
    createdDate: null,
    modifiedDate: '2023-02-08T15:23:44.828786Z',
    name: 'Marketplace',
    roles: [
      { role: 'owner', roleName: 'Owner', permissions: ['view', 'configure'] },
      { role: 'partner', roleName: 'Partner', permissions: ['view'] },
      {
        role: 'partnerViewer',
        roleName: 'Partner Wiever',
        permissions: ['view'],
      },
    ],
    appCode: 'marketplace',
    maintenanceStartDate: '2023-02-08T10:25:00',
    maintenanceEndDate: '2023-02-20T10:30:00',
    maintenanceDisplayStartDate: '2023-02-08T10:17:00',
    maintenanceDisplayEndDate: '2023-02-18T10:30:00',
    maintenanceReason: 'test xxxxx',
    bypassedUser: false,
    fullLockout: true,
  },
  {
    id: '20cb0205-5a96-4b87-a5c7-775df093e5f0',
    orgCode: null,
    inactiveDate: '2022-12-29T11:06:25.8775691Z',
    startDate: null,
    endDate: null,
    createdBy: 'nomfa@iarxservicestest.onmicrosoft.com',
    modifiedBy: 'nomfa@iarxservicestest.onmicrosoft.com',
    createdDate: '2022-12-29T10:12:42.7426204Z',
    modifiedDate: '2023-02-08T13:14:51.1722314Z',
    name: 'DEV TEST123',
    roles: [],
    appCode: 'devtest123',
    maintenanceStartDate: '2023-02-08T08:17:00',
    maintenanceEndDate: '2023-02-08T08:22:00',
    maintenanceDisplayStartDate: '2023-02-08T08:16:00',
    maintenanceDisplayEndDate: '2023-02-08T08:22:00',
    maintenanceReason: 'testing',
    bypassedUser: false,
    fullLockout: true,
  },
  {
    id: '571f6ad7-32fd-4416-bb4b-a58ae674c172',
    orgCode: null,
    inactiveDate: null,
    startDate: null,
    endDate: null,
    createdBy: 'nomfa@iarxservicestest.onmicrosoft.com',
    modifiedBy: 'nomfa@iarxservicestest.onmicrosoft.com',
    createdDate: '2022-12-29T13:50:26.7964976Z',
    modifiedDate: '2023-02-08T13:14:51.1722314Z',
    name: 'Dev Test 1234',
    roles: null,
    appCode: 'devtest1234',
    maintenanceStartDate: '2023-02-08T08:17:00',
    maintenanceEndDate: '2023-02-08T08:22:00',
    maintenanceDisplayStartDate: '2023-02-08T08:16:00',
    maintenanceDisplayEndDate: '2023-02-08T08:22:00',
    maintenanceReason: 'testing',
    bypassedUser: false,
    fullLockout: true,
  },
];
export const PlatformApplication = [
  {
    name: 'ERV',
    id: 'fc7ee72b-c117-4a07-a0a5-d9301e18f723',
    roles: [
      { role: 'pharmacist', roleName: 'Pharmacist', permissions: ['approve'] },
      { role: 'technician', roleName: 'Technitian', permissions: ['review'] },
    ],
    appCode: 'erv',
    maintenanceStartDate: '2023-02-08T08:17:00',
    maintenanceEndDate: '2023-02-08T08:22:00',
    maintenanceDisplayStartDate: '2023-02-08T08:16:00',
    maintenanceDisplayEndDate: '2023-02-08T08:22:00',
    maintenanceReason: 'testing',
    fullLockout: true,
    orgCode: 'xxxx',
    inactiveDate: null,
    startDate: null,
    endDate: '2022-04-29T16:58:39',
    createdBy: null,
    modifiedBy: 'nomfa@iarxservicestest.onmicrosoft.com',
    createdDate: null,
    modifiedDate: '2023-02-08T13:14:51.1722306Z',
  },
  {
    name: 'Analytics',
    id: '1c7ee72b-c117-4a07-a0a5-d9301e18f72f',
    roles: [
      {
        role: 'exec',
        roleName: 'Executive',
        permissions: ['operations', 'productivity', 'Hardware'],
      },
      {
        role: 'developer',
        roleName: 'Developer',
        permissions: ['test', 'operations', 'productivity'],
      },
      {
        role: 'analyst',
        roleName: 'Analyst',
        permissions: ['test', 'operations'],
      },
      { role: 'test', roleName: 'Super Tester', permissions: ['test'] },
    ],
    appCode: 'analytics',
    maintenanceStartDate: '2023-02-08T08:17:00',
    maintenanceEndDate: '2023-02-08T08:22:00',
    maintenanceDisplayStartDate: '2023-02-08T08:16:00',
    maintenanceDisplayEndDate: '2023-02-08T08:22:00',
    maintenanceReason: 'testing',
    fullLockout: true,
    orgCode: null,
    inactiveDate: null,
    startDate: null,
    endDate: '2022-04-29T16:58:39',
    createdBy: 'xyz',
    modifiedBy: 'nomfa@iarxservicestest.onmicrosoft.com',
    createdDate: null,
    modifiedDate: '2023-02-08T13:14:51.1722309Z',
  },
  {
    name: 'Platform Management',
    id: 'a0384374-2e6b-4210-bdb2-9a362d87dc0d',
    roles: [
      { role: 'admin', roleName: 'Global Admin', permissions: ['global'] },
      {
        role: 'organization',
        roleName: 'Organization Admin',
        permissions: ['organization'],
      },
    ],
    appCode: 'admin',
    maintenanceStartDate: '2023-02-08T10:28:00',
    maintenanceEndDate: '2023-02-08T10:33:00',
    maintenanceDisplayStartDate: '2023-02-08T10:28:00',
    maintenanceDisplayEndDate: '2023-02-08T10:33:00',
    maintenanceReason: 'test',
    fullLockout: true,
    orgCode: 'xyz',
    inactiveDate: null,
    startDate: null,
    endDate: '2022-04-29T16:58:39',
    createdBy: null,
    modifiedBy: 'nomfa@iarxservicestest.onmicrosoft.com',
    createdDate: null,
    modifiedDate: '2023-02-08T15:31:14.256619Z',
  },
  {
    name: 'Marketplace',
    id: '560c015e-5d7d-4e51-aed5-2f824805f523',
    roles: [
      { role: 'owner', roleName: 'Owner', permissions: ['view', 'configure'] },
      { role: 'partner', roleName: 'Partner', permissions: ['view'] },
      {
        role: 'partnerViewer',
        roleName: 'Partner Wiever',
        permissions: ['view'],
      },
    ],
    appCode: 'marketplace',
    maintenanceStartDate: '2023-02-08T10:25:00',
    maintenanceEndDate: '2023-02-20T10:30:00',
    maintenanceDisplayStartDate: '2023-02-08T10:17:00',
    maintenanceDisplayEndDate: '2023-02-18T10:30:00',
    maintenanceReason: 'test xxxxx',
    fullLockout: true,
    orgCode: 'iarx',
    inactiveDate: '2022-06-21T18:36:14.800061Z',
    startDate: null,
    endDate: '2022-04-29T16:58:39',
    createdBy: null,
    modifiedBy: 'nomfa@iarxservicestest.onmicrosoft.com',
    createdDate: null,
    modifiedDate: '2023-02-08T15:23:44.828786Z',
  },
  {
    name: 'DEV TEST123',
    id: '20cb0205-5a96-4b87-a5c7-775df093e5f0',
    roles: [],
    appCode: 'devtest123',
    maintenanceStartDate: '2023-02-08T08:17:00',
    maintenanceEndDate: '2023-02-08T08:22:00',
    maintenanceDisplayStartDate: '2023-02-08T08:16:00',
    maintenanceDisplayEndDate: '2023-02-08T08:22:00',
    maintenanceReason: 'testing',
    fullLockout: true,
    orgCode: null,
    inactiveDate: '2022-12-29T11:06:25.8775691Z',
    startDate: null,
    endDate: null,
    createdBy: 'nomfa@iarxservicestest.onmicrosoft.com',
    modifiedBy: 'nomfa@iarxservicestest.onmicrosoft.com',
    createdDate: '2022-12-29T10:12:42.7426204Z',
    modifiedDate: '2023-02-08T13:14:51.1722314Z',
  },
  {
    name: 'Dev Test 1234',
    id: '571f6ad7-32fd-4416-bb4b-a58ae674c172',
    roles: null,
    appCode: 'devtest1234',
    maintenanceStartDate: '2023-02-08T08:17:00',
    maintenanceEndDate: '2023-02-08T08:22:00',
    maintenanceDisplayStartDate: '2023-02-08T08:16:00',
    maintenanceDisplayEndDate: '2023-02-08T08:22:00',
    maintenanceReason: 'testing',
    fullLockout: true,
    orgCode: null,
    inactiveDate: null,
    startDate: null,
    endDate: null,
    createdBy: 'nomfa@iarxservicestest.onmicrosoft.com',
    modifiedBy: 'nomfa@iarxservicestest.onmicrosoft.com',
    createdDate: '2022-12-29T13:50:26.7964976Z',
    modifiedDate: '2023-02-08T13:14:51.1722314Z',
  },
];
export const userData = {
  discriminator: 'user',
  address: {
    street: '12 Maple Street',
    city: 'Atlanta',
    zip: '76346',
    state: 'TXS',
  },
  email: 'wag@walgreens.com',
  firstName: 'Admin',
  lastName: 'Wag',
  phone: '11231231234',
  title: 'Mr.',
  officeAddress: null,
  applications: [
    {
      appCode: 'admin',
      sites: [],
      roles: [
        { role: 'organization', roleName: null, permissions: ['organization'] },
      ],
    },
    {
      appCode: 'analytics',
      sites: [
        {
          siteId: '54eb723e-c9a9-4930-8dbf-12b54bc9078e',
          siteCode: 'NorthLake',
        },
        { siteId: '3cfd80ea-c529-493f-9104-f7a69b957ff6', siteCode: 'Memphis' },
        { siteId: '901d3e63-3101-4835-82f8-c31e6fece512', siteCode: 'Denver' },
        {
          siteId: 'dc9f48c1-13ab-4ec7-90f1-cfe5929d5052',
          siteCode: 'Orlando_QS',
        },
        {
          siteId: 'a4611be6-11b9-4859-b9f1-696b51f68360',
          siteCode: 'Mansfield_QS',
        },
        {
          siteId: 'a001675d-7259-4d50-8118-f3fdfb9aa7c6',
          siteCode: 'Indianapolis',
        },
        {
          siteId: '223f09cf-54db-4912-8b84-3f0318b7b16d',
          siteCode: 'Bolingbrook',
        },
        { siteId: '74d30e9e-d7f9-44ca-a03a-19013419f5b0', siteCode: 'Liberty' },
        { siteId: '72d146e7-cba9-41f2-b31e-75b969e23e1d', siteCode: 'Orlando' },
        {
          siteId: '392f476a-e1f3-4330-9144-3f5c1cf4b02d',
          siteCode: 'Liberty_QS',
        },
        {
          siteId: 'fd05d4e0-5609-44dd-b1e2-3cc9e5c7b1e9',
          siteCode: 'Mansfield',
        },
      ],
      roles: [
        {
          role: 'exec',
          roleName: null,
          permissions: ['opera', 'productivity'],
        },
      ],
    },
  ],
  bypassUser: false,
  id: 'wag@walgreens.com',
  orgCode: 'wag',
  inactiveDate: null,
  startDate: null,
  endDate: null,
  createdBy: 'ag',
  modifiedBy: 'nomfa@iarxservicestest.onmicrosoft.com',
  createdDate: '2022-06-16T00:00:00',
  modifiedDate: '2023-02-09T19:35:59.4230937Z',
};
export const Report = {
  id: '26f42171-0528-4e24-8592-fad82f6327f2',
  embedUrl:
    'https://app.powerbi.com/reportEmbed?reportId=26f42171-0528-4e24-8592-fad82f6327f2\u0026groupId=6aac6bd2-188a-4af7-ba8b-dcf382239a09\u0026w=2\u0026config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVVTLU5PUlRILUNFTlRSQUwtRy1QUklNQVJZLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0IiwiZW1iZWRGZWF0dXJlcyI6eyJtb2Rlcm5FbWJlZCI6dHJ1ZSwidXNhZ2VNZXRyaWNzVk5leHQiOnRydWV9fQ%3d%3d',
  accessToken:
    'H4sIAAAAAAAEAB3Tta7lBgBF0X95rSOZKdIUvmZm7Mx0zewo_56Z9LtaR-efHyt9vlNa_Pz90xWyzyY5dCk8jgelDSsywPjTmY3NsrEs8HSVECuJeelnqnUQo5vFzu-JtFTWpl480DVrmnNKmXVNSfrTcuIO3C8ZZ9k9CsvDU9qJf98TwTZlmC_Wkc3F_D0wbdctmMhashSB9Jo6erYPUd5gtGXg-UU3dMEdkkAEkiCR4dsycxCu9g0BOEzxc89oM1b1Spg2Xb3oBlyI2OwsqetPff2aoHiyBiwlahXbjMGRV86-Usi5rJjY6zpjdWjo8g1sXj4dtwtqA6K2jvRSznl-DtwMgs5w-XxCcpiqj6itYRaFcGZOAyy5dl1OfXZMrNFDBLwE4-usC3nVV9-fJiWBiKM5AVXdt6qsKkaYXgirAUeLPOa74xWDFSsLIUFSAs2Eb7vVRUQNuk0z6XCIVkQSJ40xhDYQ54cY-CBkcYLIL-YGuzPbhxVYih1AcPaTJAU5S4O3S2xDnVSbmy17pVSKagqKDpBypP7erXkkRPLaA_GjSDATNwofOVIsY0PISCB35nXf5sqXVbod3CGq4lBgeK5Baw_d4qxTKH1vITk5244kbBi5uPxe0dw3wQaXtByqDtwI4Y1pD84SkekqCXKiuPnk1RGD9wmvH4KeGkQvokdA4uoCB507_1hBa3_OYrBJhbvgfAkSrPZaMjXikPTsMr0FmRbGjKif8YJ82SxJjH-kNhJ8Mfza0fA14okWi_GOogneMixAyABstot6AU_9DAtEN6JsQB9vs_yaHyXxjRs_k3VN05USyqCTY8TRTDzoBBrG5GkSAW_A7GM4-VKFo7lXnIFv3cZbDVrX9Q0O6g74tIzLlby3FcenNUvA4Wbtqjza0JcdHTUfJIKUpbQyz-E8MC03ic9487U2QnTDLXGgNsxf_rC_wt58E5GK2_cAVVibMw1R2EhFwGrXyGb_kNnmyizKx7yYfiChta5dGicqQ7kS6Cga8qoiaPTLEgPQNb5mYXz2n79-2PWZ90ktn993ZgklqkCQv7NFGBwYtShsvCFqCc4ZaRvM_2gGnbAa7KdItw8J6BgBJPZ3gy8R6Gnjhs5rtTHSW19tpZdTEFfV4VVKjTKRhX3QuOjV38NIhqfM6dcweabSuVhhjKxM7EqePbwoptImNYpJ7ZNU3oa96cTJAN9jdT2PIRdPS4o12pwJQQoERoMaKsLGK3v57vv-kcspxi7dtSJDpBGBZgWqgjvQY8lEYcc2FRQQB5yFPAb1Wfp5zfI3B2Jfs-bubCkiXm9PQGa1MMrZ4ET8iq--2-7JGgf3AAt7Or3E5DMTQ1gacGH_0yzciYI7Kigtc42GYdhh5QoyHBLHKj8NArhedGD1r19_mJ-5KVc5-K1c3qO9vzndxjPmvKmqJBMJ2v9XbluP6X6s5e8sor2QCZEKGwXXmcvcAQJxs4YEjky727SJW9UoSMfGvN33DXcVjzLpZhsOSq3zwc-vyyGrvEN0980-Y-hMqrdV76rzPCox1EMfAHBMdSZBo7JVNc6G_du2jWql0uiOFHBk_roYqcgs4gbVgFjG4bYXdadBMAPv11u76mcBPfPrHZH2sJ3NWnxyKPTJkvBFWMbD6jewc-pgP0dePCu8bp9evFsAjjzTp6pX_zBlx2vMRHlfHYcAmck2o8NHBLgQdJaK6TO0ePFem2d-gE6Rp_qefXTYoYEA1Hbo1W7cSmj2RbmoQs1MGtEgIPu2QcoT6FlJFGdkY40fobGauiSI53ZUy-wP87__Ab75XsrCBgAA.eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVVTLU5PUlRILUNFTlRSQUwtRy1QUklNQVJZLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0IiwiZXhwIjoxNjc3MDY0NDU1LCJhbGxvd0FjY2Vzc092ZXJQdWJsaWNJbnRlcm5ldCI6dHJ1ZX0=',
};
export const config = {
  marketBaseUrl:
    'https://apim-nexiacc-dev-eastus2-a5efee35.azure-api.net/platform-api',
  platformBaseUrl:
    'https://apim-nexiacc-dev-eastus2-a5efee35.azure-api.net/platform-api',
  logoutSSO:
    'https://apim-nexiacc-dev-eastus2-a5efee35.azure-api.net/platform-api/SSOLogout',
  oidcConfig: {
    issuer: 'https://iarx-services.oktapreview.com/oauth2/default/',
    clientId: '0oa2e7f4dvYLDDdmw1d7',
    redirectUri: 'http://localhost:3000/login/callback',
    pkce: true,
  },
  instrumentationKey: '8f2e56e0-9ec2-491d-80bb-42f37ada0f5f',
  REACT_APP_SUITES_URL:
    'https://apim-nexiacc-dev-eastus2-a5efee35.azure-api.net/platform-api/GetSuitesByPermission',
  REACT_APP_POWERBI_URL:
    'https://apim-nexiacc-dev-eastus2-a5efee35.azure-api.net/platform-api/Reports/Report',
  DEFAULT_REPORTID: '3c7d3cd2-a042-4632-b88e-73517df4678d',
};