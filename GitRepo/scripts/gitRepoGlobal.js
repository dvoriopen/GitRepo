let app = angular.module('myApp',[]);

var currentScope = null;

var alert_dialog = null;
function alert(message, title)
{
    alert_dialog = new BootstrapDialog({
        id: "alert_dialog",
        message: message,
        size: BootstrapDialog.SIZE_NORMAL,
        title: title || 'message',
        animate: false,
        draggable: { handle: ".modal-header" },
        buttons: [{
            id: "alert_okBtn",
            label: "OK",
            cssClass: 'btn-primary',
            action: function (dialogRef) {
                dialogRef.close();
                alert_dialog = null;
            }
        }]
    });
    alert_dialog.open();
    $(this).find('#alert_okBtn').focus();
}

function loading() {
    $('#loader').show();
    $('#loader-page').show();
}
function finishLoading() {
    $('#loader').hide();
    $('#loader-page').hide();
}

app.controller('myCtrl', ['$scope', '$http', '$timeout', myCtrl]);
app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});
 

function myCtrl($scope, $http, $timeout) {

    currentScope = $scope || angular.element(document.querySelector('[ng-app=myApp]')).scope();

    $scope.searchInput = null;

    $scope.repo_items = [];

    $scope.repo_message = null;

    $scope.repo_bookmarkItems = [];

    $scope.repo_bookmarkMessage = null;
    
    $scope.showBookmarkView = false;

    $scope.refresh=function(cleanSearch)//refresh repo screen properties
    {
        if (cleanSearch == true)
            $scope.searchInput = null;
        $scope.repo_message =null;        
        $scope.repo_items = [];
    }

    $scope.repo_bookmarkRefresh = function () {//refresh Bookmark screen properties
        $scope.repo_bookmarkItems = [];
        $scope.repo_bookmarkMessage = null;
    }

    $scope.gitHub_searchRepo = function (searchStr) {//clean and go to search function

        if (searchStr != null && searchStr.trim() != '') {
            $scope.refresh();
            $scope.gitHub_getRepo(searchStr);
        }

    }

    $scope.gitHub_getRepo = function (searchStr) {//go to server to search repository
        loading();
        $http({
            url: 'https://api.github.com/search/repositories?q=' + searchStr,
            method: "GET",
            async: false,
            contentType: "application/json",
            headers: {
                "Content-Type": "application/json"
            }
        }).success(function (res) {
            finishLoading();
            if (res != null && res.items != null && res.items.length > 0) {
                $scope.repo_items = $scope.gitHub_getRepoItems(res.items);
            }
            else
                $scope.repo_message = "no data found ";            
        })

       .error(function (data, status, headers, config) {
           finishLoading();
           alert('אירעה שגיאה אנא פנה לשירות המערכת', "שגיאה");
       });
    }

    $scope.gitHub_getRepoItems = function (repoData)//to extract the items from repository data
    {
        let list = [];
        for (let i = 0; i < repoData.length; i++)
        {
            let item = repoData[i];
            let n_item = { id: item.id, name: item.name, avatarURL: item.owner.avatar_url};
            list.push(n_item);
        }
        return list;
    }

    $scope.gitHub_setBookmark = function (repo_selectedItem)//add to bookmark list and save in session
    {
        $http({
            url: baseURL + 'Home/SetSessionBookmarkItems',
            method: "POST",
            async: false,
            data: JSON.stringify({
                repoItem: repo_selectedItem,
            }),
            contentType: "application/json",
            headers: {
                "Content-Type": "application/json"
            }
        }).success(function (res) {
            if (!res.error) {
                alert("bookmark success");
            }
            else
                alert("failed");
        })
       .error(function (data, status, headers, config) {
           alert('אירעה שגיאה אנא פנה לשירות המערכת', "שגיאה");
       });
    }

    $scope.gitHub_getBookmarks = function () {//get the bookmark items from session
        $http({
            url: baseURL + 'Home/GetSessionBookmarkItems',
            method: "GET",
            async: false,
            data: JSON.stringify({
            }),
            contentType: "application/json",
            headers: {
                "Content-Type": "application/json"
            }
        }).success(function (res) {
            if (!res.error) {
                if (res.res != null && res.res.length > 0)
                {
                    $scope.repo_bookmarkItems = res.res;
                }
                else
                {
                    $scope.repo_bookmarkItems = [];
                    $scope.repo_bookmarkMessage = "no data found";
                }
                $scope.showBookmarkView = true;
            }
            else
                alert('אירעה שגיאה אנא פנה לשירות המערכת', "שגיאה");
        })
       .error(function (data, status, headers, config) {
           alert('אירעה שגיאה אנא פנה לשירות המערכת', "שגיאה");
       });
    }

    $scope.gitHub_showBookmarks = function ()//show Bookmark screen
    {
        $scope.repo_bookmarkRefresh();
        $scope.gitHub_getBookmarks("gitHub_redirectToBookmarks");
    }

}
 
