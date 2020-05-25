import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../_services/user.service';
import { TokenStorageService } from './../_services/token-storage.service';
import { PostService } from '../_services/post.service';
import Post from '../models/post';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardParticipantService } from './../_services/board-participant.service';
// ---------------- chat SocketIO ----------------
import { ChatService } from './../_services/chat.service';

import { Observable, Subscription } from 'rxjs';
import { Document } from 'src/app/models/document';
import { startWith } from 'rxjs/operators';

// ---------------- fin chat SocketIO ----------------

@Component({
  selector: 'app-board-participant',
  templateUrl: './board-participant.component.html',
  styleUrls: ['./board-participant.component.css']
})
export class BoardParticipantComponent implements OnInit {
  content = '';
  isLoggedIn = false;
  username: string;
  role: string;
  posts: Post[];
  // ---------------- chat SocketIO ----------------
  // newMessage: string;
  // messageList: string[] = [];
  documents: Observable<string[]>;
  currentDoc: string;
  private _docSub: Subscription;
  document: Document;
  // ---------------- fin chat SocketIO ----------------

  constructor(private route: ActivatedRoute, private userService: UserService, private tokenStorageService: TokenStorageService, private bs: BoardParticipantService, private ps: PostService, private router: Router, private chatService: ChatService) { }



  // ---------------- chat SocketIO ----------------
  // sendMessage() {
  //   this.chatService.sendMessage(this.newMessage);
  //   this.newMessage = '';
  // }
  // ---------------- fin chat SocketIO ----------------


  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.username = user.username;
      // ---------------- chat SocketIO ----------------
      // this.chatService
      //   .getMessages()
      //   .subscribe((message: string) => {
      //     this.messageList.push(message);
      //   });
      this.documents = this.chatService.documents;
      this._docSub = this.chatService.currentDocument.subscribe(doc => this.currentDoc = doc.id);
      // ---------------- fin chat SocketIO ----------------
      this.bs
        .getPosts()
        .subscribe((data: Post[]) => {
          this.posts = data;
        });
      this._docSub = this.chatService.currentDocument.pipe(
        startWith({ id: '', doc: 'Select an existing document or create a new one to get started' })
      ).subscribe(document => this.document = document);


    }
  }
  // ---------------- chat SocketIO ----------------
  gOnDestroy() {
    this._docSub.unsubscribe();
  }

  loadDoc(id: string) {
    this.chatService.getDocument(id);
  }

  newDoc() {
    this.chatService.newDocument();
  }
  editDoc() {
    this.chatService.editDocument(this.document);
  }
  // ---------------- fin chat SocketIO ----------------

  login() {
    document.getElementById("mat-side").style.background = '#000000BB';
  }
  deletePost(id: any, index: number) {
    this.ps.deletePost(id).subscribe(res => {
      this.posts.splice(index, 1);
    });
  }
}

