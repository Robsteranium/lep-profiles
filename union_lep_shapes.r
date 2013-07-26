# https://geoportal.statistics.gov.uk/Docs/Boundaries/Local_authority_district_(GB)_Dec_2012_Boundaries_(Generalised_Clipped).zip
library(rgdal)
library(maptools)

uk <- readOGR("/storage/robin/data/ONS_Geography/Boundaries/Local_authority_district_(GB)_Dec_2012_Boundaries_(Generalised_Clipped)/","LAD_DEC_2012_GB_BGC")
uk.ll <- spTransform(uk, CRS("+proj=longlat +datum=WGS84 +no_defs +ellps=WGS84 +towgs84=0,0,0"))


leps <- read.csv("/home/robin/Code/d3.pion/LEP_lookup.csv")



# ID <- uk.ll@data$LAD12CDO %in% leps[leps$LEP=="Black Country", "ONS.LA..District..Unitary..Code..OLD."]
# bc.poly <- unionSpatialPolygons(uk.ll, ifelse(ID,"Black Country",NA))
# bc.data <- data.frame(1)
# row.names(bc.data) <- c("Black Country")
# bc.df <- SpatialPolygonsDataFrame(bc.poly, data=bc.data)
# writeOGR(bc.df, "/home/robin/Code/d3.pion/bc_test", "BlackCountry", driver="ESRI Shapefile")

shp.data <- data.frame(name=unique(leps$LEP))
row.names(shp.data) <- shp.data$name

get_unified_poly <- function(lep_name) {
  la_codes <- leps[leps$LEP==lep_name, "ONS.LA..District..Unitary..Code..OLD."]
  lep_ids  <- uk.ll@data$LAD12CDO %in% la_codes
  lep_poly <- unionSpatialPolygons(uk.ll, ifelse(lep_ids,lep_name,NA))@polygons[[1]]
  return(lep_poly)
}

lep.polys <- alply(as.character(shp.data$name), c(1), get_unified_poly)

shp.df <- SpatialPolygonsDataFrame(SpatialPolygons(lep.polys), data=shp.data)
writeOGR(shp.df, "/home/robin/Code/d3.pion/lep_shapes", "lep_shapes", driver="ESRI Shapefile")

shp.df.simple <- SpatialPolygonsDataFrame(gSimplify(SpatialPolygons(lep.polys), tol=0.025), data=shp.data)
writeOGR(shp.df.simple, "/home/robin/Code/d3.pion/lep_shapes_simple", "lep_shapes", driver="ESRI Shapefile")
