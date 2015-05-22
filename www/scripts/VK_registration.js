if(VK != undefined) {
	VK.init({
		apiId: 4708668
	});
	function authInfo(response){
		if(response.session) {
			Authentification(response.session.mid);
		} else {
			alert('Ошибка!');
		}
	}

	VK.Auth.getLoginStatus(authInfo);
	VK.UI.button('login_button');
}

function VK_Log(){
	if(VK != undefined)
		VK.Auth.login(authInfo);
	else
		Authentification(5076376);

}