## set origin target (enter your own, by default it is SWF) 

Target_origin <- "SWF"

##### Program run: 

#set working directory 

setwd("/Users/gdrey/Desktop/proj/wd")
  
#load libraries 
library(ggrepel)
library(ggplot2)
library(dplyr)
library(readr)
library(tidyverse)
library(conflicted)
library(dplyr)
library(data.table)
library(maptools)
library(mapdata)

#address conflicts in tidyverse
filter <- dplyr::filter
filter(mtcars, am & cyl == 8)

## convert zipped dataset (from FAA) to .csv

# enter .zip path and output folder 
zipF<- "/Users/gdrey/Desktop/proj/data/Origin_and_Destination_Survey_DB1BCoupon_2018_1.zip"
outDir<-"/Users/gdrey/Desktop/proj/data/"
unzip(zipF,exdir=outDir)

## load datasets (in this case airports and coupon DB1B data)
airports <- read.csv("/Users/gdrey/Desktop/proj/data/airports.csv",stringsAsFactors = FALSE, header = TRUE)
coupon <- read_csv("/Users/gdrey/Desktop/proj/data/Origin_and_Destination_Survey_DB1BCoupon_2018_1.csv")

# select only needed columns 
select_col_airports<-select(airports, "iata_code","latitude_deg","longitude_deg")
select_col_coupon<-select(coupon,"Year","Origin","Dest")

#remove outlier set (PHL) and if IATA Code is blank 
select_col_airports<- select_col_airports[-c(38593), ]

#QC
head(select_col_airports,5)
head(select_col_coupon,5)

# perform merges 
merge_to_origin <- merge(select_col_coupon, select_col_airports, by.x = "Origin", by.y = "iata_code",all.x=TRUE)
route_data <- merge(merge_to_origin, select_col_airports, by.x = "Dest", by.y = "iata_code",all.x=TRUE)

#QC 

head(route_data,5)

#rename columns to make more sense 
names(route_data)[names(route_data)=="latitude_deg.x"] <- "origin_lat"
names(route_data)[names(route_data)=="longitude_deg.x"] <- "origin_long"
names(route_data)[names(route_data)=="latitude_deg.y"] <- "dest_lat"
names(route_data)[names(route_data)=="longitude_deg.y"] <- "dest_long"

#QC

head(route_data,5)

# select Target Origin from airports
Airport_origin_0<- route_data %>% filter(Origin == Target_origin)

#filter out missing data 
Airport_origin_0[!complete.cases(Airport_origin_0),]
Airport_origin <- na.omit(Airport_origin_0)

## create map based on all flight routes 
#basemap 
usMap <- borders("state", colour="gray", fill="white")

ggplot() + usMap

#map with route data 
allUSA <- ggplot() + usMap +

  geom_curve(data=Airport_origin,
             aes(x=origin_long, y=origin_lat, xend=dest_long, yend=dest_lat),
             col="#00008b",
             size=.2,
             curvature=0.2) +
  geom_point(data=Airport_origin,
             aes(x=origin_long, y=origin_lat), 
             colour="blue",
             size=1) +
  geom_point(data=Airport_origin,
             aes(x=dest_long, y=dest_lat), 
             colour="blue") +
  theme(axis.line=element_blank(),
        axis.text.x=element_blank(),
        axis.text.y=element_blank(),
        axis.title.x=element_blank(),
        axis.title.y=element_blank(),
        axis.ticks=element_blank(),
        plot.title=element_text(hjust=0.5, size=12)) +
  ggtitle("United State Flight Route Map")

#view the map 
allUSA
