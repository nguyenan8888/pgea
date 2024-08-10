import {
  CircularProgress,
  Grid,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CustomList } from './FormTab'
import { Icon } from '@iconify/react'
import GridEditor from 'src/@core/components/grid-editor'
import { v4 } from 'uuid'

export const dataTypes = ['string', 'number', 'date', 'boolean']

export const displays = ['image', 'progressbar']

export const defaultGrid = {
  name: '',
  field: '',
  hideExpression: '',
  roles: [],
  type: dataTypes[0],
  formatNumber: false,
  enumable: false,
  items: [],
  modelSelect: false,
  arraySelect: false,
  modelSelectApi: '',
  hiddenWhere: [],
  allowByPassHiddenWhere: false,
  modelSelectField: '',
  select: '',
  display: displays[0],
  reverseColor: false,
  filterable: false,
  filterRange: false,
  stringID: false,
  bindButton: false
}

const GridTab = ({ grid = [], apis = [], onChange, showSave, setShowSave }) => {
  const { t } = useTranslation()

  const [selectedTab, setSelectedTab] = useState(grid?.[0]?.id)
  const [listGrid, setListGrid] = useState(grid)
  const [selectedGrid, setSelectedGrid] = useState(grid?.[0])
  const [loadingSelectGrid, setLoadingSelectGrid] = useState(false)

  useEffect(() => {
    onChange && onChange(listGrid)
  }, [listGrid, onChange])

  const handleAddGrid = () => {
    setListGrid(prev => [...prev, { ...defaultGrid, id: v4() }])
  }

  const handleSelectGrid = id => {
    if (showSave && !window.confirm(t('message.notSaveConfirm', { value: t('common.grid') }))) return

    const grid = listGrid.find(grid => grid.id === id)
    if (!grid) return

    setSelectedGrid(() => null)

    setLoadingSelectGrid(true)
    setSelectedTab(grid.id)
    showSave && setShowSave(false)
    setTimeout(() => {
      setSelectedGrid(() => grid)
      setLoadingSelectGrid(false)
    }, 200)
  }

  const handleRemoveGrid = id => {
    if (!window.confirm(t('message.confirmRemove', { value: t('common.grid') }))) return
    setListGrid(prev => prev.filter(grid => grid.id !== id))
    if (selectedGrid && selectedGrid.id === id) {
      setSelectedGrid(null)
      setSelectedTab(null)
    }
  }

  const handleSaveGrid = data => {
    setListGrid(prev => prev.map(grid => (grid.id === data.id ? data : grid)))
  }

  const onCopyGrid = data => {
    const target = listGrid.findIndex(grid => grid.id === data.id)

    if (target >= 0) {
      const newListGrid = [...listGrid.slice(0, target + 1), { ...data, id: v4() }, ...listGrid.slice(target + 1)]

      setListGrid(() => newListGrid)
    }
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={2} style={{ paddingLeft: 0 }}>
        <CustomList>
          <ListItem disablePadding>
            <ListItemText primary={t('common.grid')} />
            <ListItemSecondaryAction>
              <IconButton edge='end' onClick={handleAddGrid}>
                <Icon icon='tabler:plus' fontSize={20} />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          {listGrid.map((grid, index) => (
            <ListItem disablePadding key={grid.id}>
              <ListItemButton selected={selectedTab === grid.id} onClick={e => handleSelectGrid(grid.id)}>
                <ListItemText primary={grid.name || `No Name ${index + 1}`} />
                <ListItemSecondaryAction>
                  <IconButton edge='end'>
                    <Icon
                      icon='tabler:trash'
                      fontSize={20}
                      onClick={e => {
                        e.stopPropagation()
                        handleRemoveGrid(grid.id)
                      }}
                    />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItemButton>
            </ListItem>
          ))}
        </CustomList>
      </Grid>
      <Grid item xs={10}>
        {loadingSelectGrid && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5rem' }}>
            <CircularProgress />
          </div>
        )}
        {selectedGrid && (
          <GridEditor
            grid={selectedGrid}
            apis={apis}
            onSave={handleSaveGrid}
            showSave={showSave}
            setShowSave={setShowSave}
            onCopyGrid={onCopyGrid}
          />
        )}
      </Grid>
    </Grid>
  )
}

export default GridTab
