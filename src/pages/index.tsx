import { Center, Container } from "@chakra-ui/layout"
import { defaults } from "react-chartjs-2"
import React, { useState } from 'react';

defaults.global.animation = false;

interface PointStruct {
  x: number;
  y: number
}

let parseRaw = (rawText: string) => {
  let arr = rawText.split("\n")
  let normalisation = true
  let normalisationFreq = 500
  let normalisationOffset = 80
  let normalisationValue = 0
  let rawValues: Array<PointStruct> = []
  let points: Array<PointStruct> = []
  arr.forEach(row => {
    if (!row.startsWith("*")) {
      let point = row.split("	") //tab
      if (point.length == 3) {
        rawValues.push({
          x: parseFloat(point[0]),
          y: parseFloat(point[1])
        })
      }
    }
  })
  if (normalisation) {
    rawValues.forEach(set => {
      if (set.x <= normalisationFreq) {
        return normalisationValue = set.y - normalisationOffset
      }
    })
  }
  rawValues.forEach(set => {
    points.push({
      x: set.x,
      y: set.y - normalisationValue
    })
  })
  return points
}
interface DataSet {
  label: string
  data: Array<PointStruct>
  fill: boolean
  pointRadius: number
  cubicInterpolationMode: string
}
  let set: Array<DataSet> = []
  let graphData = {
    datasets: set,
  }

const Index = () => {
  const [currentPhones, setPhones] = useState(graphData)

  let phonesToRequest = ["Whizzer Kylin L", "Moondrop SSR L"]

  if (currentPhones.datasets.length < 1 && phonesToRequest.length !== 0) {
    phonesToRequest.forEach(async phone => {

      let res = await fetch("https://squig.link/data_mrs/" + phone + ".txt")
      let data = await res.text()
      console.log(data)
      graphData.datasets.push({
        label: phone,
        data: parseRaw(data),
        fill: false,
        pointRadius: 1.1,
        cubicInterpolationMode: "monotone",
      })
      setPhones(graphData)
    })
  }

  console.log(currentPhones)
  return (
    <Container height="100vh" centerContent>
      <Center height="100vh" width="100vw">
          {JSON.stringify(currentPhones.datasets)}
      </Center>
    </Container>
  )
}

export default Index