package main

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strconv"

	"github.com/gocolly/colly"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

type AccountInfo struct {
	Github string `query:"github"`
	Gitlab string `query:"gitlab" json:"gitlab"`
}

type ContributionData struct {
	Date  string `json:"date"`
	Count int    `json:"count"`
}

type ContributionDataList struct {
	Github []ContributionData `json:"github"`
	Gitlab []ContributionData `json:"gitlab"`
}

func getContributionDataAtGithub(c *colly.Collector, contributionDataList *ContributionDataList, userName string) {
	c.OnHTML("svg.js-calendar-graph-svg", func(e *colly.HTMLElement) {
		e.ForEach("rect", func(_ int, rect *colly.HTMLElement) {
			date := rect.Attr("data-date")
			count, _ := strconv.Atoi(rect.Attr("data-count"))
			contributionData := ContributionData{Date: date, Count: count}
			contributionDataList.Github = append(contributionDataList.Github, contributionData)
		})
	})

	c.Visit("https://github.com/" + userName)
}

func getContributionDataAtGitlab(c *colly.Collector, contributionDataList *ContributionDataList, userName string) {
	url := "https://gitlab.com/users/" + userName + "/calendar.json"
	resp, _ := http.Get(url)
	defer resp.Body.Close()
	byteArray, _ := ioutil.ReadAll(resp.Body)
	jsonBytes := ([]byte)(byteArray)

	responseJson := make(map[string]int)
	err := json.Unmarshal(jsonBytes, &responseJson)
	if err != nil {
		panic(err)
	}

	for date, count := range responseJson {
		contributionData := ContributionData{Date: date, Count: count}
		contributionDataList.Gitlab = append(contributionDataList.Gitlab, contributionData)
	}
}

func (contributionDataList *ContributionDataList) getByAccount(userAccount *AccountInfo) {
	c := colly.NewCollector()
	getContributionDataAtGithub(c, contributionDataList, userAccount.Github)
	getContributionDataAtGitlab(c, contributionDataList, userAccount.Gitlab)
}

func handler(c echo.Context) error {
	userAccount := new(AccountInfo)
	if err := c.Bind(userAccount); err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return (err)
	}

	contributionDataList := new(ContributionDataList)
	contributionDataList.getByAccount(userAccount)
	c.JSON(http.StatusOK, contributionDataList)
	return (nil)
}

func main() {
	e := echo.New()

	e.Use(middleware.CORS())

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Routes
	e.GET("/", handler)

	// Start server
	e.Logger.Fatal(e.Start("localhost:8080"))
}
