const subnavLinks = document.querySelectorAll(".subnav-link");
const sceneTabs = document.querySelectorAll(".scene-tab");
const scenePanels = document.querySelectorAll(".scene-panel");
const panels = document.querySelectorAll(".panel");
const pageTitle = document.getElementById("pageTitle");
const breadcrumbLabel = document.getElementById("breadcrumbLabel");
const actionButtons = document.querySelectorAll(".action-btn");
const toast = document.getElementById("toast");

const drawer = document.getElementById("drawer");
const drawerBackdrop = document.getElementById("drawerBackdrop");
const drawerClose = document.getElementById("drawerClose");
const drawerCancel = document.getElementById("drawerCancel");
const drawerConfirm = document.getElementById("drawerConfirm");
const drawerTitle = document.getElementById("drawerTitle");
const drawerDesc = document.getElementById("drawerDesc");
const drawerBadges = document.getElementById("drawerBadges");
const drawerSections = document.querySelectorAll(".drawer-section");

const drawerConfigs = {
  detail: {
    title: "详情查看",
    desc: "用于查看物资同步、状态回写、审批联动和追踪信息。",
    badges: ["查看详情", "联动回写", "台账追踪"],
  },
  import: {
    title: "导入台账",
    desc: "支持导入物资数据、领用数据和专项台账数据。",
    badges: ["导入", "批量更新", "数据校验"],
  },
  edit: {
    title: "新增 / 编辑",
    desc: "用于新增或编辑特殊劳动防护用品的主数据和检查信息。",
    badges: ["新增", "编辑", "主数据维护"],
  },
  delete: {
    title: "删除确认",
    desc: "删除前再次确认对象，避免误删影响台账和统计。",
    badges: ["删除确认", "不可撤回", "同步更新"],
  },
  assign: {
    title: "物资分配",
    desc: "支持分配部门、分配公用、分配个人和分配外部人员四种方式。",
    badges: ["分配部门", "分配公用", "分配个人", "分配外部人员"],
  },
  scrap: {
    title: "公用物资报废",
    desc: "选择报废时间、报废数量与原因，完成后自动回写报废台账。",
    badges: ["报废", "指定时间", "回写台账"],
  },
  "undo-scrap": {
    title: "撤消报废",
    desc: "将误报废或需修正的记录恢复到可用状态，并同步库存。",
    badges: ["撤消报废", "恢复库存", "更新履历"],
  },
  return: {
    title: "归还处理",
    desc: "完成借用物资归还确认，自动更新借用状态与归还时间。",
    badges: ["归还", "状态更新", "通知催还"],
  },
  "export-zip": {
    title: "按年导出 ZIP",
    desc: "支持以人为单位按年导出，文件以 ZIP 压缩包形式提供。",
    badges: ["按年导出", "按人导出", "ZIP 压缩包"],
  },
  check: {
    title: "更新检查时间",
    desc: "按上次送检日期推算下次检测节点，提前 15 天提醒待检查数据。",
    badges: ["更新检查时间", "15天提醒", "专项台账"],
  },
  receive: {
    title: "领取确认",
    desc: "PC 与 APP 同步领取流程，领取时支持手写签字确认。",
    badges: ["领取", "手写签字", "同步回写"],
  },
  replace: {
    title: "更换申请",
    desc: "员工端发起更换申请后进入审批工作流，审批完成后更新台账。",
    badges: ["更换", "审批流", "台账更新"],
  },
};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function openDrawer(mode) {
  const config = drawerConfigs[mode] || drawerConfigs.detail;
  drawerTitle.textContent = config.title;
  drawerDesc.textContent = config.desc;
  drawerBadges.innerHTML = config.badges
    .map((label) => `<span class="drawer-badge">${label}</span>`)
    .join("");

  drawerSections.forEach((section) => {
    section.classList.toggle("active", section.dataset.mode === mode);
  });

  drawer.classList.add("open");
  drawerBackdrop.classList.add("show");
}

function closeDrawer() {
  drawer.classList.remove("open");
  drawerBackdrop.classList.remove("show");
}

subnavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    subnavLinks.forEach((item) => item.classList.remove("active"));
    panels.forEach((panel) => panel.classList.remove("active"));

    link.classList.add("active");
    document.getElementById(link.dataset.target).classList.add("active");
    pageTitle.textContent = link.textContent;
    breadcrumbLabel.textContent = link.textContent;
  });
});

sceneTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    sceneTabs.forEach((item) => item.classList.remove("active"));
    scenePanels.forEach((panel) => panel.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.scene).classList.add("active");
  });
});

actionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const mode = button.dataset.drawer;
    if (mode) {
      openDrawer(mode);
      return;
    }
    showToast(`已触发：${button.textContent}。原型中可继续接入真实流程。`);
  });
});

drawerBackdrop.addEventListener("click", closeDrawer);
drawerClose.addEventListener("click", closeDrawer);
drawerCancel.addEventListener("click", closeDrawer);
drawerConfirm.addEventListener("click", () => {
  showToast(`已提交：${drawerTitle.textContent}。`);
  closeDrawer();
});

window.addEventListener("load", () => {
  drawerBadges.innerHTML = drawerConfigs.detail.badges
    .map((label) => `<span class="drawer-badge">${label}</span>`)
    .join("");
  window.setTimeout(() => {
    showToast("已补全流程抽屉、场景切换和统计分析原型。");
  }, 400);
});
