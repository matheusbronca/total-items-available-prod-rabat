import React, { useEffect, useMemo, useState } from 'react'
import { useProduct } from 'vtex.product-context'
import { useCssHandles } from 'vtex.css-handles'
import axios from 'axios'

import styles from './styles/totalItemsAvailable.module.css'

const CSS_HANDLES = ['wrapper', 'label', 'value']

interface ITotalItemsAvailable {
  message: string
  pluralMessage: string
  emptyMessage: string
  hiddenWhenMax?: number
}

const TotalItemsAvailable: StorefrontFunctionComponent<ITotalItemsAvailable> = ({
  message = '{totalItemsAvailable} unit available',
  pluralMessage = '{totalItemsAvailable} units available',
  emptyMessage = '',
  hiddenWhenMax
}) => {
  const styleHandles = useCssHandles(CSS_HANDLES)
  const productContext = useProduct()

  const [totalAvailableStock, setTotalAvailableStock] = useState<number | null>(
    null
  )

  const [selectedSku, setSelectedSku] = useState<string>('')

  useEffect(() => {
    if (selectedSku) {
      const fetchURL = `/_v/total-items-available/${selectedSku}`

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      axios.get(fetchURL).then((response: any) => {
        return setTotalAvailableStock(response.data ?? null)
      })
    }
  }, [selectedSku])

  useEffect(() => {
    if (!productContext) return
    setSelectedSku(productContext?.selectedItem?.itemId ?? '')
  }, [productContext])

  const finalMessage = useMemo(() => {
    if (totalAvailableStock == 1)
      return message
    if (totalAvailableStock && totalAvailableStock > 1)
      return pluralMessage

    return emptyMessage
  }, [totalAvailableStock])

  if (!selectedSku || totalAvailableStock === null)
    return (
      <div
        className={`${styles.totalItemsAvailable} ${styleHandles.totalItemsAvailable}`}
      />
    )

  if (hiddenWhenMax != null && totalAvailableStock > hiddenWhenMax) {
    return null
  }

  const renderMessage = (actualMessage: string) =>
    actualMessage.replace(
      '{totalItemsAvailable}',
      `<strong className=${styleHandles.value} ${styles.value
      }}>${totalAvailableStock.toString()}</strong>`
    )

  return (
    <div className={styleHandles.wrapper}>
      <div
        className={`${styles.label} ${styleHandles.label}`}
        dangerouslySetInnerHTML={{ __html: renderMessage(finalMessage) }}
      />
    </div>
  )
}

TotalItemsAvailable.schema = {
  title: 'Total Available Items',
  description:
    'An app who renders a customized message containing the total amount of a product in stock.',
  type: 'object',
  properties: {
    message: {
      title: 'Mensagem',
      description:
        'Mensagem para ser renderizada quando a quantidade produtos no estoque for igual a 1. Para utilizar o valor total de itens disponíveis no estoque em sua mensagem utilize o formato {totalItemsAvailable}. Exemplo: "Itens disponíveis em estoque: {totalItemsAvailable}".',
      type: 'string',
    },
    pluralMessage: {
      title: 'Mensagem Plural',
      description:
        'Mensagem para ser renderizada quando a quantidade de produtos no estoque for maior que 1. Para utilizar o valor total de itens disponíveis no estoque em sua mensagem utilize o formato {totalItemsAvailable}. Exemplo: "Itens disponíveis em estoque: {totalItemsAvailable}".',
      type: 'string',
    },
    emptyMessage: {
      title: 'Mensagem estoque vazio',
      description:
        'Mesagem para ser renderizada quando a quantidade de produtos no estoque for igual a zero (0). Para utilizar o valor total de itens disponíveis no estoque em sua mesagem utilize o formato {totalItemsAvailable}. Exemplo: "Itens disponíveis em estoque: {totalItemsAvailable}".',
      type: 'string',
    },
    hiddenWhenMax: {
      title: 'Esconder quando estoque for maior que:',
      description: 'Ocultar bloco quando quantidade em estoque for maior que o valor informado',
      type: 'number'
    },
  },
}

export default TotalItemsAvailable
