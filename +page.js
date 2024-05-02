import Papa from 'papaparse'

export const load = async ({ fetch }) => {
      
      // Sales & purchases data
      const responseDataFig1 = await fetch('http://localhost:5173/DataFig1.csv', {
        headers: {
          'Content-Type': 'text/csv'
      }})
      let csvDataFig1 = await responseDataFig1.text()
      let parsedCsvDataFig1 = Papa.parse(csvDataFig1, {header: true})
      
      // Cities data
      const responseCitiesCoordinates = await fetch('http://localhost:5173/CitiesCoordinates.csv', {
        headers: {
          'Content-Type': 'text/csv'
      }})
      let csvCitiesCoordinates = await responseCitiesCoordinates.text()
      let parsedCsvCitiesCoordinates = Papa.parse(csvCitiesCoordinates, {header: true})     

    return {
      inventory: parsedCsvDataFig1.data,
      cities: parsedCsvCitiesCoordinates.data
    }
}

export const ssr = false;