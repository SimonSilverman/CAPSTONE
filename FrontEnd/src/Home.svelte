<script>
	import Modal from './Modal.svelte';
    import Sidebar from './sidebar.svelte';
	

	export let params;
	let modelList = params.models;

	let showModal = false;
	let showSideBar = false;

	const toggleModal = () => {
		showModal = !showModal;
		let button = document.getElementById('signModal');
		if(button.style.visibility == 'hidden'){
			document.getElementById('signModal').style.visibility = 'visible';
		}else document.getElementById('signModal').style.visibility = 'hidden';
	}

	const toggleShowBar = () => {
		showSideBar = !showSideBar;
	}

	let email = "";
	let username = "";
	let password = "";
	let confPassword = "";
	let passCheck = "";


	let logEmail = "";
	let logPassword = "";
	let logResponse = "";

	let loggedUser = "";
	let loggedEmail = "";
	let isLoggedIn = false;
	
	const isSamePass = () =>{
		if (password != confPassword){
			passCheck = "Passwords do not match!"
		}else{
			passCheck = ""
		}
	}

	const register = () => {
		if (email.trim() == "" || username.trim() == "" || password.trim() == ""){
			passCheck = "Please fill in all fields!";
			return;
		}
		let pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
		if (passCheck == "Passwords do not match!") return;
		if (!pattern.test(password)){
			passCheck += "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, and 1 number."
			return
		}
		
		//use the xml request handler to send a post
		passCheck = "loading..."
		let newUser = JSON.stringify({'_id':email, username,password});
        const request = new XMLHttpRequest();
        request.open("POST", "http://localhost:5000/createUser");
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
        request.send(newUser);
        request.onload = () =>{
			if(request.responseText == 1){
				doLogin(username, email);
				showModal = false;
			}else{
				passCheck = request.responseText;
			}
        }

	};

	const login = () =>{
		let logUser = JSON.stringify({"email":logEmail, "password":logPassword});
		logResponse = "Logging in..."
        const request = new XMLHttpRequest();
        request.open("POST", "http://localhost:5000/login");
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
        request.send(logUser);
        request.onload = () =>{
			logResponse = request.responseText;
			if(logResponse != "Incorrect email or password"){
				let userInfo = JSON.parse(logResponse);
				doLogin(userInfo.username, userInfo._id);
			}
			//if successful hit a log in method with the username and email items returned to you
        }
	}

	const doLogin = (user, em) =>{
		loggedUser = user;
		loggedEmail = em;
		isLoggedIn = true;
		showModal = false;
		document.cookie = JSON.stringify({loggedUser, loggedEmail})
	}


	const onLoad = () =>{
		try{
		let userObj = JSON.parse(document.cookie)
		doLogin(userObj.loggedUser, userObj.loggedEmail)
		}
		catch(error){}
	}

	onLoad()


</script>

{#if !isLoggedIn}
	<Modal showModal={showModal} on:click={toggleModal}>
		<div id='flex-form'>
			<form id='login'>
				<input type="text" name="email" id="logEmail" placeholder="Email" bind:value={logEmail}>
				<br>
				<input type="text" name="password" id="logPassword" placeholder="Password" bind:value={logPassword}>
				<p class="passConf">{logResponse}</p>
				<br>
				<button on:click|preventDefault={login}>Login</button>
			</form>
			<div id='bar'></div>
			<form id='register'>
				<input type="text" name="email" id="email" placeholder="Email" bind:value={email}>
				<br>
				<input type="text" name="username" id="username" placeholder="Username" bind:value={username}>
				<br>
				<input type="password" name="password" id="password" placeholder="Password" bind:value={password} on:focusout={isSamePass}>
				<br>
				<input type="password" name="checkpass" id="checkPass" placeholder="Confirm Password" bind:value={confPassword} on:focusout={isSamePass}>
				<p class="passConf">{passCheck}</p>
				<br>
				<button on:click|preventDefault={register}>Register</button>
			</form>
		</div>
	</Modal>
{/if}
<Sidebar showSideBar={showSideBar}></Sidebar>
<main>
	{#if isLoggedIn}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<p class=curUser on:click={toggleShowBar}>{loggedUser}</p>
	{:else}
	<button on:click={toggleModal} id="signModal">Login/Sign Up</button>
	{/if}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="headerWrapper">
		<div style="width: 467px;">
			<div class="logo logoMainPage" on:click={()=>{window.open('https://www.linkedin.com/in/%F0%9F%90%8Dsimon-silverman-581443220/', '_blank');}}></div>
		</div>
		<div id="textWrapper">
			<h1>Welcome to ML-Silver</h1>
			<h3>ML-Silver's creator had one goal in mind:</h3>
			<h4>Bring machine learning to the everyday person, and make it as easy as possible.</h4>
		</div>
	</div>

	<div class="modelList">
		<!-- <div style="border-bottom-width: 1.5px;" class="horBar"></div> -->
		<div class="modelWrapper tableHeaders">
			<div class="modelID">ID</div>
			<div class="modelName">Model Name</div>
			<div class="modelUser">Created By</div>
			<div class="modelDate">Date Created</div>
			<div class="modelType">Model Type</div>
			<div class="modelDescription">Model Description</div>
			<div style="width: 5%;">Use</div>
		</div>
	{#each modelList as model}
		<div class="modelWrapper">
			<div class="modelID">{model.id}</div>
			<div class="modelName">{model.name}</div>
			<div class="modelUser">{model.createdBy}</div>
			<div class="modelDate">{model.dateCreated}</div>
			<div class="modelType">{model.modelType}</div>
			<div class="modelDescription" title={model.description}>{model.description}</div>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="modelGo" on:click={()=>{document.location.href=`/UseModel/${model.id}`}}>GO</div>
			
		</div>
	{/each}
		<div style="top-bottom-width: 1.5px;" class="horBar"></div>
	</div>
</main>


<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
		user-select: none;
	}

	h1 {
		color: white;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
		margin-bottom: 1%;
	}

	h3 {
		color: orange;
		text-transform: uppercase;
		font-size: 2.5em;
		font-weight: 100;
	}

	h4 {
		color: orange;
		text-transform: uppercase;
		font-size: 2em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	#signModal{
		position: absolute;
		top: 1.5%;
		right: 1%;
		visibility: visible;
		cursor: pointer;
	}

	.passConf{
        color:red;
        font-size: 70%;
		/* height: 10%; */
    }

	#flex-form{
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
	}

	#bar{
		width: 0.5%;
		background: orange;
	}

	.logoMainPage{
		width: 467px;
		height: 241px;
	}

	.logoMainPage:hover{
		cursor: pointer;
	}

	
	


	.headerWrapper{
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
	}

	#textWrapper{
		margin-top: 4%;
	}

	


</style>