import zhBase from './zh'
import enBase from './en'

/**
 * 注入 about 长文到简介区块，并计算项目数量在统计首项
 */
function finalize(base) {
  const { about, projects, startSection, featuresChessSection, statsSection, ...rest } = base
  return {
    ...rest,
    about,
    projects,
    startSection: { ...startSection, sub: about.intro },
    featuresChessSection: {
      ...featuresChessSection,
      row1: { ...featuresChessSection.row1, body: about.intro },
      row2: { ...featuresChessSection.row2, body: about.skills },
    },
    statsSection: {
      items: statsSection.items.map((item, i) =>
        i === 0 ? { ...item, value: `${projects.length}+` } : item,
      ),
    },
  }
}

export const siteZh = finalize(zhBase)
export const siteEn = finalize(enBase)

export const BUNDLES = { zh: siteZh, en: siteEn }
