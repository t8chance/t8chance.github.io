# Hong Kong typhoon signal forecasts · 香港熱帶氣旋警告信號預報

**[t8chance.github.io](https://t8chance.github.io/)**

The chance that the Hong Kong Observatory issues tropical cyclone warning signal No. 3, No. 8 or No. 10, worked out from the newest
ECMWF and Google DeepMind forecasts and updated every 6 hours.

根據 ECMWF 及 Google DeepMind 最新電腦預報，推算香港天文台發出三號、八號或十號熱帶氣旋警告信號的機會，每 6 小時更新。

> This site is research output, not an official forecast. The Hong Kong Observatory is the only authority for warning signals.
> 所有結果均由電腦自動計算，僅供研究參考，並非香港天文台官方預報。實際警告信號以香港天文台公布為準。

## What is in this repository

| Folder | Contents |
|---|---|
| `site/` | the pages, in English and Chinese |
| `data/` | the forecast numbers the pages read |

Everything here is published automatically after each forecast update.

## Data and credits

- **ECMWF.** The IFS and AIFS ensembles and the archived ensembles from TIGGE. This service is based on data and products of the European
  Centre for Medium-Range Weather Forecasts (ECMWF), [www.ecmwf.int](https://www.ecmwf.int). This ECMWF data is published under a Creative
  Commons Attribution 4.0 International licence ([CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)). It is modified here into Hong Kong
  signal chances, wind estimates and charts. ECMWF does not accept any liability whatsoever for any error or omission in the data, their
  availability, or for any loss or damage arising from their use.
- **Google DeepMind.** Past Weather Lab cyclone forecasts are used under its
  [terms of use](https://storage.googleapis.com/weathernext-public/terms-of-use.pdf) and are shown as signal chances only. Google is not
  involved in this site.
- **Copernicus.** Pangu-Weather re-forecasts from WeatherBench 2 start from ERA5, and ERA5 is used for past storms before 2008. Contains
  modified Copernicus Climate Change Service information (2026). Neither the European Commission nor ECMWF is responsible for any use that
  may be made of the Copernicus information or data it contains.
- **NOAA.** The Global Ensemble Forecast System (GEFS) Re-forecast. NOAA is not involved in this site.
- **Hong Kong Observatory.** Best tracks, warning signals and station winds were used to check and set up the forecasts. The signal shown
  as in force is read from HKO's open data on [DATA.GOV.HK](https://data.gov.hk) under the DATA.GOV.HK terms.

This site is not endorsed by any of the organisations above.
