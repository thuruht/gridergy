from fastapi import FastAPI, HTTPException
import gridstatus
import pandas as pd
from datetime import datetime

app = FastAPI(title="Gridergy RTC+B Ingestion Service")

# Initialize the ERCOT ISO connection
ercot = gridstatus.Ercot()

# 7 Load Zones defined for RTC+B 2026 specs
LOAD_ZONES = [
    "LZ_COAST", "LZ_NORTH", "LZ_SOUTH", "LZ_SOUTH_CENTRAL",
    "LZ_WEST", "LZ_PANHANDLE", "LZ_FAR_WEST"
]

@app.get("/scrape/rtc-lmp")
def scrape_rtc_lmp():
    """
    Fetches the latest RTC_SETTLEMENT_LMP for the 7 defined Load Zones.
    """
    try:
        # Fetching real-time 5-minute LMP data (RTC+B standard)
        # Assuming gridstatus has been updated for RTC+B or using real_time_5_min
        df = ercot.get_spp(date="latest")

        # Filter for the 7 active load zones
        zone_data = df[df['Location'].isin(LOAD_ZONES)]

        # Process and normalize data
        payload = []
        for _, row in zone_data.iterrows():
            payload.append({
                "zone": row['Location'],
                "timestamp": row['Time'].isoformat(),
                "lmp": row['SPP'], # RTC Settlement LMP
                "is_congested": row['SPP'] > 100 # Basic proxy for congestion markup
            })

        return {"status": "success", "data": payload}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
