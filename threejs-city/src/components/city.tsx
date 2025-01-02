import { useEffect, useState } from 'react'
import { initCity } from '../utils'
import '../styles/reset.css'

function City() {
  
  useEffect(() => {
    initCity()
  })
  return (
    <>
      <canvas id='webgl'>浏览器不支持canvas，请切换浏览器重试</canvas>
    </>
  )
}

export default City
