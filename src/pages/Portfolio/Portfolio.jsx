import { useParams } from 'react-router-dom'
import style from './Portfolio.module.scss'
import { useTranslation } from 'react-i18next'
import useAuth from '../../hooks/useAuth'
import { usePortfolio } from '../../hooks/usePortfolio'
import Metadata from '../../utils/metadata'

// components
import List from './ui/List/List'
import SinglePortfolio from './ui/SinglePortfolio/SinglePortfolio'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import Icon from 'components/Icon/Icon'

//* Portfolio page
function Portfolio() {
  const { t } = useTranslation()
  const { portfolioId } = useParams()
  const { isAdmin } = useAuth()
  const { portfolios, currentPortfolio, loading, error, setPortfolios } =
    usePortfolio(portfolioId)

  //* 渲染載入狀態
  if (loading) {
    return <LoadingSpinner />
  }

  //* 渲染錯誤狀態
  if (error) {
    return <ErrorMessage message={error} />
  }

  //* 渲染作品集列表
  if (!portfolioId) {
    return (
      <>
        <Metadata
          title={`${t('portfolio', { ns: 'header' })} | ${t('title', {
            ns: 'header',
          })}`}
          description="探索 John 的網頁設計與開發專案作品集"
        />
        <div className={style.project}>
          <div className={style.container}>
            <List
              isAdmin={isAdmin}
              portfolios={portfolios}
              setPortfolios={setPortfolios}
            />
          </div>
        </div>
      </>
    )
  }

  //* 渲染單一作品集
  if (!currentPortfolio) {
    return (
      <div className={style.notFoundProject}>
        <Icon name="circle-exclamation" />
        <h1>{t('portfolioNotFound', { ns: 'portfolio' })}</h1>
      </div>
    )
  }

  return (
    <SinglePortfolio
      portfolioId={portfolioId}
      currentPortfolio={currentPortfolio}
    />
  )
}

export default Portfolio
