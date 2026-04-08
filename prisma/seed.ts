// ============================================
// G-NEX Platform - Database Seed
// ============================================

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

// Use TCP connection for seed (prisma dev local server)
const adapter = new PrismaPg({
  connectionString:
    process.env.DIRECT_DATABASE_URL ||
    "postgres://postgres:postgres@localhost:51214/template1?sslmode=disable",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...\n");

  // ----------------------------------------
  // 1. Admin User
  // ----------------------------------------
  const adminPassword = await bcrypt.hash("admin123456", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@gnex.jp" },
    update: {},
    create: {
      email: "admin@gnex.jp",
      passwordHash: adminPassword,
      role: "ADMIN",
      status: "ACTIVE",
      emailVerified: new Date(),
    },
  });
  console.log(`✓ Admin user: ${admin.email} (password: admin123456)`);

  // ----------------------------------------
  // 2. Sample Client (発注者)
  // ----------------------------------------
  const clientPassword = await bcrypt.hash("client123456", 12);
  const client = await prisma.user.upsert({
    where: { email: "client@example.com" },
    update: {},
    create: {
      email: "client@example.com",
      passwordHash: clientPassword,
      role: "CLIENT",
      status: "ACTIVE",
      emailVerified: new Date(),
      clientProfile: {
        create: {
          companyName: "サンプル工場株式会社",
          contactName: "田中 太郎",
          phone: "06-1234-5678",
          buildingType: "FACTORY_WAREHOUSE",
          prefecture: "大阪府",
          city: "大阪市中央区",
        },
      },
    },
  });
  console.log(`✓ Client user: ${client.email} (password: client123456)`);

  // ----------------------------------------
  // 3. Sample Contractor (受注者 - 通常)
  // ----------------------------------------
  const contractorPassword = await bcrypt.hash("contractor123456", 12);
  const contractor = await prisma.user.upsert({
    where: { email: "contractor@example.com" },
    update: {},
    create: {
      email: "contractor@example.com",
      passwordHash: contractorPassword,
      role: "CONTRACTOR",
      status: "ACTIVE",
      emailVerified: new Date(),
      contractorProfile: {
        create: {
          companyName: "エコソリューション株式会社",
          contactName: "鈴木 一郎",
          phone: "03-9876-5432",
          description:
            "太陽光発電・蓄電池の設計施工を専門とする企業です。関東・関西エリアで500件以上の施工実績があります。",
          serviceUnits: ["UNIT_A", "UNIT_B"],
          serviceAreas: ["東京都", "神奈川県", "大阪府", "兵庫県"],
          completedCount: 523,
          approvedAt: new Date(),
        },
      },
    },
  });
  console.log(
    `✓ Contractor user: ${contractor.email} (password: contractor123456)`,
  );

  // ----------------------------------------
  // 4. Sample Lead Buyer (受注者 - リード購入型)
  // ----------------------------------------
  const leadBuyerPassword = await bcrypt.hash("leadbuyer123456", 12);
  const leadBuyer = await prisma.user.upsert({
    where: { email: "leadbuyer@example.com" },
    update: {},
    create: {
      email: "leadbuyer@example.com",
      passwordHash: leadBuyerPassword,
      role: "LEAD_BUYER",
      status: "ACTIVE",
      emailVerified: new Date(),
      leadBuyerProfile: {
        create: {
          companyName: "補助金サポート行政書士事務所",
          contactName: "佐藤 花子",
          phone: "06-5555-1234",
          category: "LEGAL",
          serviceAreas: ["大阪府", "京都府", "兵庫県", "奈良県"],
        },
      },
    },
  });
  console.log(
    `✓ Lead buyer user: ${leadBuyer.email} (password: leadbuyer123456)`,
  );

  // ----------------------------------------
  // 5. Lead Pricing (リード単価設定)
  // ----------------------------------------
  const leadPricingData = [
    {
      leadType: "SUBSIDY" as const,
      priceYen: 15000,
      updatedBy: admin.id,
    },
    {
      leadType: "FINANCE" as const,
      priceYen: 15000,
      updatedBy: admin.id,
    },
    {
      leadType: "WASTE" as const,
      priceYen: 10000,
      updatedBy: admin.id,
    },
  ];

  for (const pricing of leadPricingData) {
    await prisma.leadPricing.upsert({
      where: { leadType: pricing.leadType },
      update: { priceYen: pricing.priceYen },
      create: pricing,
    });
  }
  console.log("✓ Lead pricing: SUBSIDY=¥15,000 / FINANCE=¥15,000 / WASTE=¥10,000");

  // ----------------------------------------
  // 6. Simulator Configs (シミュレーター変数)
  //    Requirements Section 7 の設定例をそのまま投入
  // ----------------------------------------

  // 設定例1: 太陽光発電 (Pattern A)
  await prisma.simulatorConfig.upsert({
    where: { slug: "solar-power" },
    update: {},
    create: {
      name: "太陽光発電",
      slug: "solar-power",
      serviceUnit: "UNIT_A",
      pattern: "PATTERN_A",
      sortOrder: 1,
      inputLabel: "屋根の広さ（平米）",
      inputUnit: "㎡",
      variable1: 0.15,
      variable2: 250000,
      variable3: 0.33,
      variable4: 50000000,
      variable5: 30000,
      variable6: 0.45,
      variable1Label: "規模換算係数（1㎡あたりkW）",
      variable2Label: "投資単価（1kWあたり工事費・円）",
      variable3Label: "補助率",
      variable4Label: "補助金上限額（円）",
      variable5Label: "年間削減単価（1kWあたり年間削減額・円）",
      variable6Label: "CO2削減単価（1kWあたり年間CO2削減量・トン）",
    },
  });

  // 設定例2: 高効率空調・LED (Pattern B)
  await prisma.simulatorConfig.upsert({
    where: { slug: "hvac-led" },
    update: {},
    create: {
      name: "高効率空調・LED",
      slug: "hvac-led",
      serviceUnit: "UNIT_B",
      pattern: "PATTERN_B",
      sortOrder: 2,
      inputLabel: "現在の月間電気代（円）",
      inputUnit: "円/月",
      variable1: 12,
      variable2: 2.5,
      variable3: 0.33,
      variable4: 20000000,
      variable5: 0.3,
      variable6: 0.000017,
      variable1Label: "年間換算係数",
      variable2Label: "投資額倍率（年間電気代の何倍）",
      variable3Label: "補助率（省エネ補助金）",
      variable4Label: "補助金上限額（円）",
      variable5Label: "コスト削減率",
      variable6Label: "CO2換算係数（1円削減あたりCO2削減量）",
    },
  });

  // 設定例3: EV充電設備・V2H (Pattern A)
  await prisma.simulatorConfig.upsert({
    where: { slug: "ev-charger" },
    update: {},
    create: {
      name: "EV充電設備・V2H",
      slug: "ev-charger",
      serviceUnit: "UNIT_C",
      pattern: "PATTERN_A",
      sortOrder: 3,
      inputLabel: "充電器の台数（台）",
      inputUnit: "台",
      variable1: 1,
      variable2: 1500000,
      variable3: 0.5,
      variable4: 5000000,
      variable5: 100000,
      variable6: 1.5,
      variable1Label: "規模換算係数",
      variable2Label: "投資単価（1台あたり・円）",
      variable3Label: "補助率",
      variable4Label: "補助金上限額（円）",
      variable5Label: "年間削減単価（1台あたり燃料費削減・円）",
      variable6Label: "CO2削減単価（1台あたり年間CO2削減量・トン）",
    },
  });

  // 設定例4: 産廃・有価物買取 (Pattern B - 特殊ロジック)
  await prisma.simulatorConfig.upsert({
    where: { slug: "waste-recycling" },
    update: {},
    create: {
      name: "産廃・有価物買取",
      slug: "waste-recycling",
      serviceUnit: "UNIT_D",
      pattern: "PATTERN_B",
      sortOrder: 4,
      inputLabel: "現在の月間産廃処理費（円）",
      inputUnit: "円/月",
      variable1: 12,
      variable2: 0, // 初期投資0円
      variable3: 0, // 補助金なし
      variable4: 0, // 上限なし
      variable5: 0.5,
      variable6: 0.00001,
      variable1Label: "年間換算係数",
      variable2Label: "投資額倍率（0=初期投資不要）",
      variable3Label: "補助率",
      variable4Label: "補助金上限額（円）",
      variable5Label: "コスト削減率（有価物利益変換率）",
      variable6Label: "CO2換算係数（リサイクルによるCO2削減）",
    },
  });

  console.log("✓ Simulator configs: solar-power / hvac-led / ev-charger / waste-recycling");

  // ----------------------------------------
  // 7. Photo Guides (写真撮影ガイド) - サンプル
  // ----------------------------------------
  const photoGuides = [
    // Unit A: 太陽光
    {
      serviceUnit: "UNIT_A" as const,
      title: "屋根全体の写真",
      isRequired: true,
      guideText:
        "建物の屋根全体が映るように撮影してください。可能であれば上空から、難しい場合は建物から離れて撮影してください。",
      sortOrder: 1,
    },
    {
      serviceUnit: "UNIT_A" as const,
      title: "屋根の素材・状態がわかる写真",
      isRequired: true,
      guideText:
        "屋根の素材（スレート、折板、陸屋根等）がわかるよう近くから撮影してください。劣化箇所がある場合はその部分も撮影してください。",
      sortOrder: 2,
    },
    {
      serviceUnit: "UNIT_A" as const,
      title: "分電盤の写真",
      isRequired: false,
      guideText: "建物の分電盤を撮影してください。扉を開けた状態で、型番が読めるように撮影してください。",
      sortOrder: 3,
    },
    // Unit B: 省エネ
    {
      serviceUnit: "UNIT_B" as const,
      title: "現在の空調設備の写真",
      isRequired: true,
      guideText: "室外機・室内機の両方を撮影してください。型番ラベルが読める写真も追加してください。",
      sortOrder: 1,
    },
    {
      serviceUnit: "UNIT_B" as const,
      title: "照明設備の写真",
      isRequired: false,
      guideText: "現在の照明器具の全体写真と、器具のアップ写真を撮影してください。",
      sortOrder: 2,
    },
    // Unit C: EV
    {
      serviceUnit: "UNIT_C" as const,
      title: "充電器設置予定場所の写真",
      isRequired: true,
      guideText: "EV充電器を設置したい場所の全体写真を撮影してください。周辺の電源設備も含めてください。",
      sortOrder: 1,
    },
    // Unit D: 産廃
    {
      serviceUnit: "UNIT_D" as const,
      title: "廃棄物保管場所の写真",
      isRequired: true,
      guideText: "廃棄物の保管場所全体を撮影してください。分別状況がわかるように撮影してください。",
      sortOrder: 1,
    },
    {
      serviceUnit: "UNIT_D" as const,
      title: "廃棄物の種類がわかる写真",
      isRequired: false,
      guideText: "主な廃棄物の種類がわかるように個別に撮影してください（廃プラ、金属くず、紙くず等）。",
      sortOrder: 2,
    },
  ];

  for (const guide of photoGuides) {
    await prisma.photoGuide.create({ data: guide });
  }
  console.log(`✓ Photo guides: ${photoGuides.length} items created`);

  // ----------------------------------------
  // 8. Form Fields (動的フォーム項目) - サンプル
  // ----------------------------------------
  const formFields = [
    // Unit A: 太陽光
    {
      serviceUnit: "UNIT_A" as const,
      fieldType: "SELECT" as const,
      label: "設置を検討している設備",
      isRequired: true,
      options: ["太陽光発電", "蓄電池", "ソーラーカーポート", "その他"],
      sortOrder: 1,
    },
    {
      serviceUnit: "UNIT_A" as const,
      fieldType: "NUMBER" as const,
      label: "屋根面積（概算・平米）",
      placeholder: "例: 500",
      isRequired: false,
      sortOrder: 2,
    },
    {
      serviceUnit: "UNIT_A" as const,
      fieldType: "RADIO" as const,
      label: "導入形態の希望",
      isRequired: false,
      options: ["自己所有（購入）", "PPA（初期費用0円）", "リース", "未定・相談したい"],
      sortOrder: 3,
    },
    // Unit B: 省エネ
    {
      serviceUnit: "UNIT_B" as const,
      fieldType: "MULTI_SELECT" as const,
      label: "検討している省エネ対策",
      isRequired: true,
      options: [
        "LED照明への切替",
        "高効率空調への更新",
        "ボイラー更新",
        "遮熱塗装・断熱対策",
        "EMS（エネルギー管理システム）導入",
        "その他",
      ],
      sortOrder: 1,
    },
    {
      serviceUnit: "UNIT_B" as const,
      fieldType: "NUMBER" as const,
      label: "月間電気代（概算・円）",
      placeholder: "例: 500000",
      isRequired: false,
      sortOrder: 2,
    },
    // Unit C: EV
    {
      serviceUnit: "UNIT_C" as const,
      fieldType: "SELECT" as const,
      label: "希望する充電器の種類",
      isRequired: true,
      options: ["普通充電器（3〜6kW）", "急速充電器（50kW〜）", "V2H", "未定・相談したい"],
      sortOrder: 1,
    },
    {
      serviceUnit: "UNIT_C" as const,
      fieldType: "NUMBER" as const,
      label: "設置希望台数",
      placeholder: "例: 2",
      isRequired: false,
      sortOrder: 2,
    },
    // Unit D: 産廃
    {
      serviceUnit: "UNIT_D" as const,
      fieldType: "MULTI_SELECT" as const,
      label: "主な廃棄物の種類",
      isRequired: true,
      options: [
        "廃プラスチック",
        "金属くず",
        "紙くず・段ボール",
        "食品残渣",
        "医療廃棄物",
        "太陽光パネル",
        "その他",
      ],
      sortOrder: 1,
    },
    {
      serviceUnit: "UNIT_D" as const,
      fieldType: "NUMBER" as const,
      label: "月間産廃処理費（概算・円）",
      placeholder: "例: 300000",
      isRequired: false,
      sortOrder: 2,
    },
    {
      serviceUnit: "UNIT_D" as const,
      fieldType: "CHECKBOX" as const,
      label: "有価物買取の相談を希望する",
      isRequired: false,
      sortOrder: 3,
    },
  ];

  for (const field of formFields) {
    await prisma.formField.create({ data: field });
  }
  console.log(`✓ Form fields: ${formFields.length} items created`);

  // ----------------------------------------
  // 9. Sample Project (案件サンプル)
  // ----------------------------------------
  const sampleProject = await prisma.project.create({
    data: {
      ownerId: client.id,
      status: "OPEN",
      serviceUnit: "UNIT_A",
      requestType: "CONSTRUCTION",
      buildingType: "FACTORY_WAREHOUSE",
      prefecture: "大阪府",
      city: "東大阪市",
      budgetMin: 500,
      budgetMax: 1500,
      description:
        "工場の屋根に太陽光発電の導入を検討しています。屋根面積は約800㎡、折板屋根です。自家消費型を希望しますが、PPAも検討中です。補助金の活用も相談したいです。",
      leadSubsidy: true,
      isLeadTarget: true,
      formResponses: {
        equipment: "太陽光発電",
        roofArea: 800,
        preferredType: "未定・相談したい",
      },
    },
  });
  console.log(`✓ Sample project: ${sampleProject.id} (工場太陽光案件)`);

  console.log("\n✅ Seed completed successfully!");
  console.log("\n--- Login Credentials ---");
  console.log("Admin:      admin@gnex.jp / admin123456");
  console.log("Client:     client@example.com / client123456");
  console.log("Contractor: contractor@example.com / contractor123456");
  console.log("Lead Buyer: leadbuyer@example.com / leadbuyer123456");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
